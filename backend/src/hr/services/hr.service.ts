import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { LeaveRequest } from '../entities/leave-request.entity';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(LeaveRequest)
    private leaveRepo: Repository<LeaveRequest>,
  ) {}

  async getEmployees() {
    return this.employeeRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getEmployee(id: string) {
    return this.employeeRepo.findOne({ where: { id } });
  }

  async createEmployee(data: Partial<Employee>) {
    const employee = this.employeeRepo.create(data);
    return this.employeeRepo.save(employee);
  }

  async updateEmployee(id: string, data: Partial<Employee>) {
    await this.employeeRepo.update(id, data);
    return this.getEmployee(id);
  }

  async deleteEmployee(id: string) {
    return this.employeeRepo.delete(id);
  }

  async getDashboardStats() {
    const totalEmployees = await this.employeeRepo.count();
    const departments = await this.employeeRepo
      .createQueryBuilder('e')
      .select('DISTINCT e.department', 'dept')
      .getRawMany();
    const pendingLeaves = await this.employeeRepo
      .createQueryBuilder('l')
      .where('l.status = :status', { status: 'pending' })
      .getCount();

    return {
      totalEmployees,
      departments: departments.length,
      pendingLeaves,
    };
  }

  async getLeaveRequests(employeeId?: string) {
    const where = employeeId ? { employeeId } : {};
    return this.leaveRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async createLeaveRequest(data: Partial<LeaveRequest>) {
    const leave = this.leaveRepo.create(data);
    return this.leaveRepo.save(leave);
  }

  async updateLeaveRequest(id: string, data: Partial<LeaveRequest>) {
    await this.leaveRepo.update(id, data);
    return this.leaveRepo.findOne({ where: { id } });
  }

  async getLeaveStats() {
    const pending = await this.leaveRepo.count({ where: { status: 'pending' } });
    const approved = await this.leaveRepo.count({ where: { status: 'approved' } });
    const rejected = await this.leaveRepo.count({ where: { status: 'rejected' } });
    return { pending, approved, rejected };
  }
}
