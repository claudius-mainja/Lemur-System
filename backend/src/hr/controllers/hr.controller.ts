import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { HrService } from '../services/hr.service';
import { 
  CreateDepartmentDto, UpdateDepartmentDto,
  CreateEmployeeDto, UpdateEmployeeDto,
  CreateLeaveRequestDto, ApproveLeaveRequestDto,
  CreateLeaveBalanceDto, CreateAttendanceRecordDto,
  EmployeeSearchDto, LeaveRequestSearchDto, AttendanceSearchDto
} from '../dto/hr.dto';

@Controller('api/v1/hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== DEPARTMENT ENDPOINTS ====================

  @Post('departments')
  @HttpCode(HttpStatus.CREATED)
  async createDepartment(@Body() dto: CreateDepartmentDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.createDepartment(tenantId, dto) };
  }

  @Get('departments')
  async findAllDepartments(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.findAllDepartments(tenantId) };
  }

  @Get('departments/:id')
  async findDepartment(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.findDepartmentById(id, tenantId) };
  }

  @Put('departments/:id')
  async updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.updateDepartment(id, tenantId, dto) };
  }

  @Delete('departments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDepartment(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.hrService.deleteDepartment(id, tenantId);
    return { success: true };
  }

  // ==================== EMPLOYEE ENDPOINTS ====================

  @Post('employees')
  @HttpCode(HttpStatus.CREATED)
  async createEmployee(@Body() dto: CreateEmployeeDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.createEmployee(tenantId, dto) };
  }

  @Get('employees')
  async findAllEmployees(@Query() query: EmployeeSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.hrService.findAllEmployees(tenantId, query);
  }

  @Get('employees/:id')
  async findEmployee(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.findEmployeeById(id, tenantId) };
  }

  @Put('employees/:id')
  async updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.updateEmployee(id, tenantId, dto) };
  }

  @Delete('employees/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEmployee(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.hrService.deleteEmployee(id, tenantId);
    return { success: true };
  }

  @Post('employees/:id/terminate')
  async terminateEmployee(@Param('id') id: string, @Body('terminationDate') terminationDate: Date, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.terminateEmployee(id, tenantId, terminationDate) };
  }

  // ==================== LEAVE REQUEST ENDPOINTS ====================

  @Post('leave-requests')
  @HttpCode(HttpStatus.CREATED)
  async createLeaveRequest(@Body() dto: CreateLeaveRequestDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.createLeaveRequest(tenantId, dto) };
  }

  @Get('leave-requests')
  async findAllLeaveRequests(@Query() query: LeaveRequestSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.hrService.findAllLeaveRequests(tenantId, query);
  }

  @Put('leave-requests/:id/approve')
  async approveLeaveRequest(
    @Param('id') id: string,
    @Body() dto: ApproveLeaveRequestDto,
    @Headers() headers: any
  ) {
    const tenantId = this.getTenantId(headers);
    const approverId = headers['x-user-id'] || 'system';
    return { data: await this.hrService.approveLeaveRequest(id, tenantId, approverId, dto) };
  }

  // ==================== LEAVE BALANCE ENDPOINTS ====================

  @Post('leave-balances')
  @HttpCode(HttpStatus.CREATED)
  async createLeaveBalance(@Body() dto: CreateLeaveBalanceDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.createLeaveBalance(tenantId, dto) };
  }

  @Get('leave-balances')
  async findLeaveBalances(
    @Query('employeeId') employeeId: string,
    @Query('year') year: number,
    @Headers() headers: any
  ) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.findLeaveBalances(tenantId, employeeId, year) };
  }

  // ==================== ATTENDANCE ENDPOINTS ====================

  @Post('attendance')
  @HttpCode(HttpStatus.CREATED)
  async createAttendanceRecord(@Body() dto: CreateAttendanceRecordDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.createAttendanceRecord(tenantId, dto) };
  }

  @Get('attendance')
  async findAttendanceRecords(@Query() query: AttendanceSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.hrService.findAttendanceRecords(tenantId, query);
  }

  // ==================== DASHBOARD STATS ====================

  @Get('dashboard/stats')
  async getDashboardStats(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.getDashboardStats(tenantId) };
  }

  // Legacy endpoints for compatibility
  @Get('stats')
  async getStats(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.hrService.getDashboardStats(tenantId) };
  }

  @Get('leave')
  async getLeaveRequests(@Query('employeeId') employeeId: string) {
    return { data: await this.hrService.getLeaveRequests(employeeId) };
  }

  @Post('leave')
  async createLeaveRequestLegacy(@Body() data: any) {
    return { data: await this.hrService.createLeaveRequestLegacy(data) };
  }

  @Put('leave/:id')
  async updateLeaveRequestLegacy(@Param('id') id: string, @Body() data: any) {
    return { data: await this.hrService.updateLeaveRequestLegacy(id, data) };
  }

  @Get('leave/stats')
  async getLeaveStats() {
    return { data: await this.hrService.getLeaveStats() };
  }
}
