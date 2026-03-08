import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SalaryStructure, EmployeeSalary, PayrollRun, Payslip, TaxConfiguration, PayrollStatus } from '../entities/payroll.entities';
import { 
  CreateSalaryStructureDto, UpdateSalaryStructureDto,
  CreateEmployeeSalaryDto, UpdateEmployeeSalaryDto,
  CreateTaxConfigurationDto, ProcessPayrollDto, ApprovePayrollDto,
  PayrollSearchDto
} from '../dto/payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(SalaryStructure)
    private salaryStructureRepo: Repository<SalaryStructure>,
    @InjectRepository(EmployeeSalary)
    private employeeSalaryRepo: Repository<EmployeeSalary>,
    @InjectRepository(PayrollRun)
    private payrollRunRepo: Repository<PayrollRun>,
    @InjectRepository(Payslip)
    private payslipRepo: Repository<Payslip>,
    @InjectRepository(TaxConfiguration)
    private taxConfigRepo: Repository<TaxConfiguration>,
  ) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== SALARY STRUCTURE METHODS ====================

  async createSalaryStructure(tenantId: string, dto: CreateSalaryStructureDto): Promise<SalaryStructure> {
    const components = dto.components.map((c, index) => ({
      id: String(index + 1),
      ...c,
      isTaxable: c.isTaxable ?? false,
      isFixed: c.isFixed ?? true,
    }));

    const structure = this.salaryStructureRepo.create({
      ...dto,
      tenantId,
      components,
    });
    return this.salaryStructureRepo.save(structure);
  }

  async findAllSalaryStructures(tenantId: string): Promise<SalaryStructure[]> {
    return this.salaryStructureRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async findSalaryStructureById(id: string, tenantId: string): Promise<SalaryStructure> {
    const structure = await this.salaryStructureRepo.findOne({ where: { id, tenantId } });
    if (!structure) throw new NotFoundException('Salary structure not found');
    return structure;
  }

  async updateSalaryStructure(id: string, tenantId: string, dto: UpdateSalaryStructureDto): Promise<SalaryStructure> {
    const structure = await this.findSalaryStructureById(id, tenantId);
    
    if (dto.components) {
      dto.components = dto.components.map((c, index) => ({
        id: String(index + 1),
        ...c,
        isTaxable: c.isTaxable ?? false,
        isFixed: c.isFixed ?? true,
      }));
    }

    Object.assign(structure, dto);
    return this.salaryStructureRepo.save(structure);
  }

  async deleteSalaryStructure(id: string, tenantId: string): Promise<void> {
    const structure = await this.findSalaryStructureById(id, tenantId);
    await this.salaryStructureRepo.remove(structure);
  }

  // ==================== EMPLOYEE SALARY METHODS ====================

  async createEmployeeSalary(tenantId: string, dto: CreateEmployeeSalaryDto): Promise<EmployeeSalary> {
    const earnings = (dto.earnings || []).map((e, index) => ({
      id: String(index + 1),
      ...e,
      isTaxable: e.isTaxable ?? true,
    }));

    const deductions = (dto.deductions || []).map((d, index) => ({
      id: String(index + 1),
      ...d,
    }));

    const totalEarnings = dto.basicSalary + earnings.reduce((sum, e) => sum + e.amount, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);

    const employeeSalary = this.employeeSalaryRepo.create({
      ...dto,
      tenantId,
      earnings,
      deductions,
      grossSalary: totalEarnings,
      netSalary: totalEarnings - totalDeductions,
    });

    return this.employeeSalaryRepo.save(employeeSalary);
  }

  async findAllEmployeeSalaries(tenantId: string): Promise<EmployeeSalary[]> {
    return this.employeeSalaryRepo.find({
      where: { tenantId, isActive: true },
      order: { employeeName: 'ASC' },
    });
  }

  async findEmployeeSalaryById(id: string, tenantId: string): Promise<EmployeeSalary> {
    const salary = await this.employeeSalaryRepo.findOne({ where: { id, tenantId } });
    if (!salary) throw new NotFoundException('Employee salary not found');
    return salary;
  }

  async findEmployeeSalaryByEmployeeId(employeeId: string, tenantId: string): Promise<EmployeeSalary> {
    const salary = await this.employeeSalaryRepo.findOne({ 
      where: { employeeId, tenantId, isActive: true } 
    });
    return salary;
  }

  async updateEmployeeSalary(id: string, tenantId: string, dto: UpdateEmployeeSalaryDto): Promise<EmployeeSalary> {
    const salary = await this.findEmployeeSalaryById(id, tenantId);
    
    if (dto.basicSalary !== undefined || dto.earnings) {
      const earnings = (dto.earnings || salary.earnings || []).map((e: any) => ({
        ...e,
        isTaxable: e.isTaxable ?? true,
      }));
      const deductions = dto.deductions || salary.deductions || [];
      
      const basicSalary = dto.basicSalary ?? salary.basicSalary;
      const totalEarnings = basicSalary + earnings.reduce((sum: number, e: any) => sum + e.amount, 0);
      const totalDeductions = deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
      
      salary.earnings = earnings;
      salary.deductions = deductions;
      salary.basicSalary = basicSalary;
      salary.grossSalary = totalEarnings;
      salary.netSalary = totalEarnings - totalDeductions;
    }

    Object.assign(salary, dto);
    return this.employeeSalaryRepo.save(salary);
  }

  // ==================== TAX CONFIGURATION METHODS ====================

  async createTaxConfiguration(tenantId: string, dto: CreateTaxConfigurationDto): Promise<TaxConfiguration> {
    const config = this.taxConfigRepo.create({
      ...dto,
      tenantId,
      taxExemption: dto.taxExemption ?? 0,
      socialSecurityRate: dto.socialSecurityRate ?? 0,
      pensionRate: dto.pensionRate ?? 0,
      healthInsuranceRate: dto.healthInsuranceRate ?? 0,
    });
    return this.taxConfigRepo.save(config);
  }

  async findAllTaxConfigurations(tenantId: string): Promise<TaxConfiguration[]> {
    return this.taxConfigRepo.find({
      where: { tenantId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getActiveTaxConfiguration(tenantId: string): Promise<TaxConfiguration> {
    const config = await this.taxConfigRepo.findOne({
      where: { tenantId, isActive: true },
      order: { createdAt: 'DESC' },
    });
    if (!config) {
      return this.taxConfigRepo.save({
        name: 'Default',
        tenantId,
        brackets: [
          { min: 0, max: 500, rate: 0, fixed: 0 },
          { min: 500, max: 1000, rate: 10, fixed: 0 },
          { min: 1000, max: 2000, rate: 20, fixed: 50 },
          { min: 2000, max: 5000, rate: 30, fixed: 250 },
          { min: 5000, max: 999999, rate: 40, fixed: 1150 },
        ],
        taxExemption: 500,
        socialSecurityRate: 6,
        pensionRate: 5,
        healthInsuranceRate: 2,
        isActive: true,
      });
    }
    return config;
  }

  // ==================== PAYROLL RUN METHODS ====================

  async generatePayrollNumber(tenantId: string): Promise<string> {
    const count = await this.payrollRunRepo.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `PR-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async processPayroll(tenantId: string, dto: ProcessPayrollDto): Promise<PayrollRun> {
    const periodStart = new Date(dto.periodStart);
    const periodEnd = new Date(dto.periodEnd);
    const month = periodStart.getMonth() + 1;
    const year = periodStart.getFullYear();

    const existingRun = await this.payrollRunRepo.findOne({
      where: { tenantId, month, year, status: PayrollStatus.PAID },
    });
    if (existingRun) {
      throw new ConflictException('Payroll already processed for this period');
    }

    const employeeSalaries = await this.findAllEmployeeSalaries(tenantId);
    const taxConfig = await this.getActiveTaxConfiguration(tenantId);

    const employeePayslips = [];
    let totalGross = 0;
    let totalNet = 0;
    let totalDeductions = 0;
    let totalTax = 0;

    for (const salary of employeeSalaries) {
      const grossSalary = Number(salary.grossSalary);
      const deductions = Number(salary.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0);
      const taxableIncome = Math.max(0, grossSalary - (taxConfig.taxExemption || 0));
      
      let taxAmount = 0;
      for (const bracket of taxConfig.brackets || []) {
        if (taxableIncome > bracket.min) {
          const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
          taxAmount += taxableInBracket * (bracket.rate / 100) + (bracket.fixed || 0);
        }
      }

      const socialSecurity = grossSalary * ((taxConfig.socialSecurityRate || 0) / 100);
      const pension = grossSalary * ((taxConfig.pensionRate || 0) / 100);
      const healthInsurance = grossSalary * ((taxConfig.healthInsuranceRate || 0) / 100);

      const totalTaxAndDeductions = taxAmount + socialSecurity + pension + healthInsurance + deductions;
      const netSalary = grossSalary - totalTaxAndDeductions;

      employeePayslips.push({
        employeeId: salary.employeeId,
        employeeName: salary.employeeName,
        basicSalary: Number(salary.basicSalary),
        grossSalary,
        netSalary,
        totalEarnings: grossSalary - Number(salary.basicSalary),
        totalDeductions: totalTaxAndDeductions,
        totalTax: taxAmount + socialSecurity + pension + healthInsurance,
        status: PayrollStatus.DRAFT,
      });

      totalGross += grossSalary;
      totalNet += netSalary;
      totalDeductions += totalTaxAndDeductions;
      totalTax += taxAmount + socialSecurity + pension + healthInsurance;
    }

    const payrollNumber = await this.generatePayrollNumber(tenantId);

    const payrollRun = this.payrollRunRepo.create({
      payrollNumber,
      tenantId,
      periodStart,
      periodEnd,
      month,
      year,
      employeePayslips,
      totalGross: Math.round(totalGross * 100) / 100,
      totalNet: Math.round(totalNet * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      employeeCount: employeeSalaries.length,
      status: PayrollStatus.DRAFT,
      notes: dto.notes,
    });

    return this.payrollRunRepo.save(payrollRun);
  }

  async findAllPayrollRuns(tenantId: string, query: PayrollSearchDto): Promise<{ data: PayrollRun[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, month, year } = query;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (month) where.month = month;
    if (year) where.year = year;

    const [data, total] = await this.payrollRunRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findPayrollRunById(id: string, tenantId: string): Promise<PayrollRun> {
    const run = await this.payrollRunRepo.findOne({ where: { id, tenantId } });
    if (!run) throw new NotFoundException('Payroll run not found');
    return run;
  }

  async approvePayrollRun(id: string, tenantId: string, approverId: string, dto: ApprovePayrollDto): Promise<PayrollRun> {
    const run = await this.findPayrollRunById(id, tenantId);
    
    if (run.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Only draft payroll can be approved');
    }

    run.status = PayrollStatus.APPROVED;
    run.approvedBy = approverId;
    run.approvedAt = new Date();
    run.notes = dto.notes || run.notes;

    run.employeePayslips = run.employeePayslips.map(payslip => ({
      ...payslip,
      status: PayrollStatus.APPROVED,
    }));

    return this.payrollRunRepo.save(run);
  }

  async markPayrollAsPaid(id: string, tenantId: string): Promise<PayrollRun> {
    const run = await this.findPayrollRunById(id, tenantId);
    
    if (run.status !== PayrollStatus.APPROVED) {
      throw new BadRequestException('Only approved payroll can be marked as paid');
    }

    run.status = PayrollStatus.PAID;

    run.employeePayslips = run.employeePayslips.map(payslip => ({
      ...payslip,
      status: PayrollStatus.PAID,
    }));

    return this.payrollRunRepo.save(run);
  }

  // ==================== PAYSLIP METHODS ====================

  async generatePayslipNumber(tenantId: string): Promise<string> {
    const count = await this.payslipRepo.count({ where: { tenantId } });
    const year = new Date().getFullYear();
    return `PS-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async findPayslipsByEmployee(employeeId: string, tenantId: string): Promise<Payslip[]> {
    return this.payslipRepo.find({
      where: { employeeId, tenantId },
      relations: ['payrollRun'],
      order: { periodStart: 'DESC' },
    });
  }

  // ==================== DASHBOARD ====================

  async getDashboardStats(tenantId: string): Promise<any> {
    const totalEmployees = await this.employeeSalaryRepo.count({
      where: { tenantId, isActive: true },
    });

    const pendingPayroll = await this.payrollRunRepo.count({
      where: { tenantId, status: PayrollStatus.DRAFT },
    });

    const approvedPayroll = await this.payrollRunRepo.find({
      where: { tenantId, status: PayrollStatus.APPROVED },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    const lastPayroll = approvedPayroll[0];

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const thisMonthRun = await this.payrollRunRepo.findOne({
      where: { tenantId, month: currentMonth, year: currentYear },
    });

    return {
      totalEmployees,
      pendingPayroll,
      lastPayroll: lastPayroll ? {
        id: lastPayroll.id,
        payrollNumber: lastPayroll.payrollNumber,
        totalNet: lastPayroll.totalNet,
        employeeCount: lastPayroll.employeeCount,
        periodEnd: lastPayroll.periodEnd,
      } : null,
      thisMonthProcessed: !!thisMonthRun,
    };
  }
}
