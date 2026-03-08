import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { 
  CreateSalaryStructureDto, UpdateSalaryStructureDto,
  CreateEmployeeSalaryDto, UpdateEmployeeSalaryDto,
  CreateTaxConfigurationDto, ProcessPayrollDto, ApprovePayrollDto,
  PayrollSearchDto
} from '../dto/payroll.dto';

@Controller('api/v1/payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== SALARY STRUCTURE ENDPOINTS ====================

  @Post('structures')
  @HttpCode(HttpStatus.CREATED)
  async createSalaryStructure(@Body() dto: CreateSalaryStructureDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.createSalaryStructure(tenantId, dto) };
  }

  @Get('structures')
  async findAllSalaryStructures(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findAllSalaryStructures(tenantId) };
  }

  @Get('structures/:id')
  async findSalaryStructure(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findSalaryStructureById(id, tenantId) };
  }

  @Put('structures/:id')
  async updateSalaryStructure(@Param('id') id: string, @Body() dto: UpdateSalaryStructureDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.updateSalaryStructure(id, tenantId, dto) };
  }

  @Delete('structures/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSalaryStructure(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.payrollService.deleteSalaryStructure(id, tenantId);
    return { success: true };
  }

  // ==================== EMPLOYEE SALARY ENDPOINTS ====================

  @Post('salaries')
  @HttpCode(HttpStatus.CREATED)
  async createEmployeeSalary(@Body() dto: CreateEmployeeSalaryDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.createEmployeeSalary(tenantId, dto) };
  }

  @Get('salaries')
  async findAllEmployeeSalaries(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findAllEmployeeSalaries(tenantId) };
  }

  @Get('salaries/:id')
  async findEmployeeSalary(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findEmployeeSalaryById(id, tenantId) };
  }

  @Get('salaries/employee/:employeeId')
  async findEmployeeSalaryByEmployee(@Param('employeeId') employeeId: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findEmployeeSalaryByEmployeeId(employeeId, tenantId) };
  }

  @Put('salaries/:id')
  async updateEmployeeSalary(@Param('id') id: string, @Body() dto: UpdateEmployeeSalaryDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.updateEmployeeSalary(id, tenantId, dto) };
  }

  // ==================== TAX CONFIGURATION ENDPOINTS ====================

  @Post('tax-configs')
  @HttpCode(HttpStatus.CREATED)
  async createTaxConfiguration(@Body() dto: CreateTaxConfigurationDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.createTaxConfiguration(tenantId, dto) };
  }

  @Get('tax-configs')
  async findAllTaxConfigurations(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findAllTaxConfigurations(tenantId) };
  }

  @Get('tax-configs/active')
  async getActiveTaxConfiguration(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.getActiveTaxConfiguration(tenantId) };
  }

  // ==================== PAYROLL RUN ENDPOINTS ====================

  @Post('runs')
  @HttpCode(HttpStatus.CREATED)
  async processPayroll(@Body() dto: ProcessPayrollDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.processPayroll(tenantId, dto) };
  }

  @Get('runs')
  async findAllPayrollRuns(@Query() query: PayrollSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.payrollService.findAllPayrollRuns(tenantId, query);
  }

  @Get('runs/:id')
  async findPayrollRun(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findPayrollRunById(id, tenantId) };
  }

  @Post('runs/:id/approve')
  async approvePayrollRun(@Param('id') id: string, @Body() dto: ApprovePayrollDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    const approverId = headers['x-user-id'] || 'system';
    return { data: await this.payrollService.approvePayrollRun(id, tenantId, approverId, dto) };
  }

  @Post('runs/:id/mark-paid')
  async markPayrollAsPaid(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.markPayrollAsPaid(id, tenantId) };
  }

  // ==================== PAYSLIP ENDPOINTS ====================

  @Get('payslips/employee/:employeeId')
  async findPayslipsByEmployee(@Param('employeeId') employeeId: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.findPayslipsByEmployee(employeeId, tenantId) };
  }

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.payrollService.getDashboardStats(tenantId) };
  }
}
