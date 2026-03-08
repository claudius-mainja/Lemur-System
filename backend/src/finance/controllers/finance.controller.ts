import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { FinanceService } from '../services/finance.service';
import { 
  CreateAccountDto, UpdateAccountDto,
  CreateInvoiceDto, UpdateInvoiceDto,
  CreatePaymentDto, CreateExpenseDto,
  InvoiceSearchDto, ExpenseSearchDto, TransactionSearchDto, FinanceReportDto
} from '../dto/finance.dto';

@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== ACCOUNT ENDPOINTS ====================

  @Post('accounts')
  @HttpCode(HttpStatus.CREATED)
  async createAccount(@Body() dto: CreateAccountDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.createAccount(tenantId, dto) };
  }

  @Get('accounts')
  async findAllAccounts(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.findAllAccounts(tenantId) };
  }

  @Get('accounts/:id')
  async findAccount(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.findAccountById(id, tenantId) };
  }

  @Put('accounts/:id')
  async updateAccount(@Param('id') id: string, @Body() dto: UpdateAccountDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.updateAccount(id, tenantId, dto) };
  }

  @Delete('accounts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.financeService.deleteAccount(id, tenantId);
    return { success: true };
  }

  // ==================== INVOICE ENDPOINTS ====================

  @Post('invoices')
  @HttpCode(HttpStatus.CREATED)
  async createInvoice(@Body() dto: CreateInvoiceDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.createInvoice(tenantId, dto) };
  }

  @Get('invoices')
  async findAllInvoices(@Query() query: InvoiceSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.financeService.findAllInvoices(tenantId, query);
  }

  @Get('invoices/:id')
  async findInvoice(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.findInvoiceById(id, tenantId) };
  }

  @Put('invoices/:id')
  async updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.updateInvoice(id, tenantId, dto) };
  }

  @Post('invoices/:id/send')
  async sendInvoice(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.sendInvoice(id, tenantId) };
  }

  @Post('invoices/:id/cancel')
  async cancelInvoice(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.cancelInvoice(id, tenantId) };
  }

  // ==================== PAYMENT ENDPOINTS ====================

  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() dto: CreatePaymentDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.createPayment(tenantId, dto) };
  }

  @Get('payments')
  async findAllPayments(@Query() query: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.financeService.findAllPayments(tenantId, query);
  }

  // ==================== EXPENSE ENDPOINTS ====================

  @Post('expenses')
  @HttpCode(HttpStatus.CREATED)
  async createExpense(@Body() dto: CreateExpenseDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.createExpense(tenantId, dto) };
  }

  @Get('expenses')
  async findAllExpenses(@Query() query: ExpenseSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.financeService.findAllExpenses(tenantId, query);
  }

  // ==================== TRANSACTION ENDPOINTS ====================

  @Get('transactions')
  async findAllTransactions(@Query() query: TransactionSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.financeService.findAllTransactions(tenantId, query);
  }

  // ==================== REPORTS & DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.getDashboardStats(tenantId) };
  }

  @Post('reports/financial')
  async getFinancialReport(@Body() dto: FinanceReportDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.financeService.getFinancialReport(tenantId, dto) };
  }
}
