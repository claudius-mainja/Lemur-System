import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { HrService } from '../services/hr.service';
import { Employee } from '../entities/employee.entity';
import { LeaveRequest } from '../entities/leave-request.entity';

@Controller('api/hr')
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  async getEmployees() {
    return { data: await this.hrService.getEmployees() };
  }

  @Get('employees/:id')
  async getEmployee(@Param('id') id: string) {
    return { data: await this.hrService.getEmployee(id) };
  }

  @Post('employees')
  async createEmployee(@Body() data: Partial<Employee>) {
    return { data: await this.hrService.createEmployee(data) };
  }

  @Put('employees/:id')
  async updateEmployee(@Param('id') id: string, @Body() data: Partial<Employee>) {
    return { data: await this.hrService.updateEmployee(id, data) };
  }

  @Delete('employees/:id')
  async deleteEmployee(@Param('id') id: string) {
    await this.hrService.deleteEmployee(id);
    return { success: true };
  }

  @Get('stats')
  async getStats() {
    return { data: await this.hrService.getDashboardStats() };
  }

  @Get('leave')
  async getLeaveRequests(@Query('employeeId') employeeId?: string) {
    return { data: await this.hrService.getLeaveRequests(employeeId) };
  }

  @Post('leave')
  async createLeaveRequest(@Body() data: Partial<LeaveRequest>) {
    return { data: await this.hrService.createLeaveRequest(data) };
  }

  @Put('leave/:id')
  async updateLeaveRequest(@Param('id') id: string, @Body() data: Partial<LeaveRequest>) {
    return { data: await this.hrService.updateLeaveRequest(id, data) };
  }

  @Get('leave/stats')
  async getLeaveStats() {
    return { data: await this.hrService.getLeaveStats() };
  }
}
