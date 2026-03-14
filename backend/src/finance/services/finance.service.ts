import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Account, Invoice, Payment, Expense, Transaction, InvoiceStatus, InvoiceType, PaymentStatus, ExpenseCategory, TransactionType, AccountType } from '../entities/finance.entities';
import { 
  CreateAccountDto, UpdateAccountDto,
  CreateInvoiceDto, UpdateInvoiceDto,
  CreatePaymentDto, CreateExpenseDto, CreateTransactionDto,
  InvoiceSearchDto, ExpenseSearchDto, TransactionSearchDto, FinanceReportDto
} from '../dto/finance.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== ACCOUNT METHODS ====================

  async createAccount(tenantId: string, dto: CreateAccountDto): Promise<Account> {
    if (dto.isDefault) {
      await this.accountRepo.update({ tenantId, isDefault: true }, { isDefault: false });
    }

    const account = this.accountRepo.create({
      ...dto,
      tenantId,
      balance: dto.openingBalance || 0,
    });
    return this.accountRepo.save(account);
  }

  async findAllAccounts(tenantId: string): Promise<Account[]> {
    return this.accountRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async findAccountById(id: string, tenantId: string): Promise<Account> {
    const account = await this.accountRepo.findOne({ where: { id, tenantId } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async updateAccount(id: string, tenantId: string, dto: UpdateAccountDto): Promise<Account> {
    const account = await this.findAccountById(id, tenantId);
    
    if (dto.isDefault && !account.isDefault) {
      await this.accountRepo.update({ tenantId, isDefault: true }, { isDefault: false });
    }

    Object.assign(account, dto);
    return this.accountRepo.save(account);
  }

  async deleteAccount(id: string, tenantId: string): Promise<void> {
    const account = await this.findAccountById(id, tenantId);
    
    if (account.balance !== 0) {
      throw new BadRequestException('Cannot delete account with non-zero balance');
    }

    await this.accountRepo.remove(account);
  }

  // ==================== INVOICE METHODS ====================

  async generateInvoiceNumber(tenantId: string): Promise<string> {
    const count = await this.invoiceRepo.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async createInvoice(tenantId: string, dto: CreateInvoiceDto): Promise<Invoice> {
    const invoiceNumber = await this.generateInvoiceNumber(tenantId);

    let subtotal = 0;
    const items = dto.items.map((item, index) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const discountAmount = itemSubtotal * (item.discount / 100);
      const afterDiscount = itemSubtotal - discountAmount;
      const taxAmount = afterDiscount * (item.tax / 100);
      const amount = afterDiscount + taxAmount;
      subtotal += amount;

      return {
        id: String(index + 1),
        ...item,
        amount: Math.round(amount * 100) / 100,
      };
    });

    const taxAmount = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const discountAmount = itemSubtotal * (item.discount / 100);
      const afterDiscount = itemSubtotal - discountAmount;
      return sum + (afterDiscount * (item.tax / 100));
    }, 0);

    const discountAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice * (item.discount / 100));
    }, 0);

    const invoice = this.invoiceRepo.create({
      ...dto,
      tenantId,
      invoiceNumber,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total: Math.round(subtotal * 100) / 100,
      paidAmount: 0,
      dueAmount: Math.round(subtotal * 100) / 100,
      currency: dto.currency || 'USD',
    });

    return this.invoiceRepo.save(invoice);
  }

  async findAllInvoices(tenantId: string, query: InvoiceSearchDto): Promise<{ data: Invoice[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, status, customerId, startDate, endDate } = query;

    const queryBuilder = this.invoiceRepo
      .createQueryBuilder('invoice')
      .where('invoice.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(invoice.invoiceNumber LIKE :search OR invoice.customerName LIKE :search OR invoice.customerEmail LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('invoice.status = :status', { status });
    }

    if (customerId) {
      queryBuilder.andWhere('invoice.customerId = :customerId', { customerId });
    }

    if (startDate) {
      queryBuilder.andWhere('invoice.issueDate >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('invoice.issueDate <= :endDate', { endDate: new Date(endDate) });
    }

    queryBuilder
      .orderBy('invoice.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findInvoiceById(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({ where: { id, tenantId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async updateInvoice(id: string, tenantId: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findInvoiceById(id, tenantId);

    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot update paid or cancelled invoice');
    }

    if (dto.items) {
      let subtotal = 0;
      const items = dto.items.map((item, index) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const discountAmount = itemSubtotal * (item.discount / 100);
        const afterDiscount = itemSubtotal - discountAmount;
        const taxAmount = afterDiscount * (item.tax / 100);
        const amount = afterDiscount + taxAmount;
        subtotal += amount;

        return {
          id: String(index + 1),
          productId: item.productId,
          description: item.description || item.productName,
          productName: item.productName || item.description,
          quantity: item.quantity,
          unit: item.unit || 'unit',
          unitPrice: item.unitPrice,
          discount: item.discount,
          tax: item.tax,
          amount: Math.round(amount * 100) / 100,
        };
      });

      invoice.items = items;
      invoice.subtotal = Math.round(subtotal * 100) / 100;
      invoice.total = invoice.subtotal;
      invoice.dueAmount = invoice.total - invoice.paidAmount;
    }

    Object.assign(invoice, dto);
    return this.invoiceRepo.save(invoice);
  }

  async sendInvoice(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.findInvoiceById(id, tenantId);
    
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be sent');
    }

    invoice.status = InvoiceStatus.SENT;
    return this.invoiceRepo.save(invoice);
  }

  async cancelInvoice(id: string, tenantId: string): Promise<Invoice> {
    const invoice = await this.findInvoiceById(id, tenantId);
    
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot cancel paid invoice');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    return this.invoiceRepo.save(invoice);
  }

  // ==================== PAYMENT METHODS ====================

  async generatePaymentNumber(tenantId: string): Promise<string> {
    const count = await this.paymentRepo.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `PAY-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async createPayment(tenantId: string, dto: CreatePaymentDto): Promise<Payment> {
    const paymentNumber = await this.generatePaymentNumber(tenantId);

    const payment = this.paymentRepo.create({
      ...dto,
      tenantId,
      paymentNumber,
      status: PaymentStatus.COMPLETED,
    });

    const savedPayment = await this.paymentRepo.save(payment);

    if (dto.invoiceId) {
      await this.applyPaymentToInvoice(dto.invoiceId, tenantId, savedPayment);
    }

    await this.createTransactionFromPayment(tenantId, savedPayment);

    return savedPayment;
  }

  private async applyPaymentToInvoice(invoiceId: string, tenantId: string, payment: Payment): Promise<void> {
    const invoice = await this.findInvoiceById(invoiceId, tenantId);
    
    invoice.paidAmount += payment.amount;
    invoice.dueAmount = invoice.total - invoice.paidAmount;

    if (invoice.dueAmount <= 0) {
      invoice.status = InvoiceStatus.PAID;
      invoice.paidDate = payment.paymentDate;
    } else {
      invoice.status = InvoiceStatus.PARTIAL;
    }

    await this.invoiceRepo.save(invoice);
  }

  private async createTransactionFromPayment(tenantId: string, payment: Payment): Promise<void> {
    const account = await this.findAccountById(payment.accountId, tenantId);

    const transaction = this.transactionRepo.create({
      tenantId,
      accountId: payment.accountId,
      type: TransactionType.INCOME,
      description: `Payment received - ${payment.paymentNumber}`,
      amount: payment.amount,
      balance: account.balance + payment.amount,
      transactionDate: payment.paymentDate,
      reference: payment.paymentNumber,
      relatedPaymentId: payment.id,
    });

    await this.transactionRepo.save(transaction);

    account.balance += payment.amount;
    await this.accountRepo.save(account);
  }

  async findAllPayments(tenantId: string, query: any): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await this.paymentRepo.findAndCount({
      where: { tenantId },
      relations: ['invoice', 'account'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  // ==================== EXPENSE METHODS ====================

  async generateExpenseNumber(tenantId: string): Promise<string> {
    const count = await this.expenseRepo.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `EXP-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async createExpense(tenantId: string, dto: CreateExpenseDto): Promise<Expense> {
    const expenseNumber = await this.generateExpenseNumber(tenantId);

    const expense = this.expenseRepo.create({
      ...dto,
      tenantId,
      expenseNumber,
      status: PaymentStatus.COMPLETED,
    });

    const savedExpense = await this.expenseRepo.save(expense);

    await this.createTransactionFromExpense(tenantId, savedExpense);

    return savedExpense;
  }

  private async createTransactionFromExpense(tenantId: string, expense: Expense): Promise<void> {
    const account = await this.findAccountById(expense.accountId, tenantId);

    const transaction = this.transactionRepo.create({
      tenantId,
      accountId: expense.accountId,
      type: TransactionType.EXPENSE,
      description: `${expense.category} - ${expense.expenseNumber}`,
      amount: expense.amount,
      balance: account.balance - expense.amount,
      transactionDate: expense.expenseDate,
      reference: expense.expenseNumber,
      category: expense.category,
      relatedExpenseId: expense.id,
    });

    await this.transactionRepo.save(transaction);

    account.balance -= expense.amount;
    await this.accountRepo.save(account);
  }

  async findAllExpenses(tenantId: string, query: ExpenseSearchDto): Promise<{ data: Expense[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, category, status, startDate, endDate } = query;

    const queryBuilder = this.expenseRepo
      .createQueryBuilder('expense')
      .where('expense.tenantId = :tenantId', { tenantId });

    if (category) {
      queryBuilder.andWhere('expense.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('expense.status = :status', { status });
    }

    if (startDate) {
      queryBuilder.andWhere('expense.expenseDate >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('expense.expenseDate <= :endDate', { endDate: new Date(endDate) });
    }

    queryBuilder
      .orderBy('expense.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  // ==================== TRANSACTION METHODS ====================

  async findAllTransactions(tenantId: string, query: TransactionSearchDto): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, type, accountId, startDate, endDate } = query;

    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.tenantId = :tenantId', { tenantId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (accountId) {
      queryBuilder.andWhere('transaction.accountId = :accountId', { accountId });
    }

    if (startDate) {
      queryBuilder.andWhere('transaction.transactionDate >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.transactionDate <= :endDate', { endDate: new Date(endDate) });
    }

    queryBuilder
      .orderBy('transaction.transactionDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  // ==================== REPORTS & DASHBOARD ====================

  async getDashboardStats(tenantId: string): Promise<any> {
    const totalRevenue = await this.invoiceRepo.sum('paidAmount', { tenantId, status: InvoiceStatus.PAID }) || 0;
    const pendingAmount = await this.invoiceRepo.sum('dueAmount', { tenantId, status: InvoiceStatus.SENT }) || 0;
    const overdueAmount = await this.invoiceRepo.sum('dueAmount', { tenantId, status: InvoiceStatus.OVERDUE }) || 0;
    const totalInvoices = await this.invoiceRepo.count({ where: { tenantId } });
    const totalCustomers = await this.invoiceRepo
      .createQueryBuilder('invoice')
      .select('COUNT(DISTINCT invoice.customerId)', 'count')
      .where('invoice.tenantId = :tenantId', { tenantId })
      .getRawOne();
    const totalExpenses = await this.expenseRepo.sum('amount', { tenantId }) || 0;

    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      totalInvoices,
      totalCustomers: totalCustomers?.count || 0,
      totalProducts: 0,
      totalExpenses,
    };
  }

  async getFinancialReport(tenantId: string, dto: FinanceReportDto): Promise<any> {
    const { startDate, endDate, accountId } = dto;

    const where: any = {
      tenantId,
      transactionDate: Between(new Date(startDate), new Date(endDate)),
    };

    if (accountId) {
      where.accountId = accountId;
    }

    const transactions = await this.transactionRepo.find({ where });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      period: { startDate, endDate },
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      netIncome: Math.round((income - expenses) * 100) / 100,
      transactionCount: transactions.length,
    };
  }
}
