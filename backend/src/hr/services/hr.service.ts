import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere, Between } from 'typeorm';
import { 
  Employee, Department, LeaveRequest, LeaveBalance, AttendanceRecord,
  EmployeeStatus, EmploymentType, LeaveType, LeaveStatus
} from '../entities/hr.entities';
import { 
  CreateDepartmentDto, UpdateDepartmentDto,
  CreateEmployeeDto, UpdateEmployeeDto,
  CreateLeaveRequestDto, UpdateLeaveRequestDto, ApproveLeaveRequestDto,
  CreateLeaveBalanceDto, CreateAttendanceRecordDto,
  EmployeeSearchDto, LeaveRequestSearchDto, AttendanceSearchDto
} from '../dto/hr.dto';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
    @InjectRepository(LeaveRequest)
    private leaveRequestRepo: Repository<LeaveRequest>,
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepo: Repository<LeaveBalance>,
    @InjectRepository(AttendanceRecord)
    private attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async getTenantId(userId: string): Promise<string> {
    return 'default-tenant-id';
  }

  // ==================== DEPARTMENT METHODS ====================

  async createDepartment(tenantId: string, dto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepo.create({
      ...dto,
      tenantId,
    });
    return this.departmentRepo.save(department);
  }

  async findAllDepartments(tenantId: string): Promise<Department[]> {
    return this.departmentRepo.find({
      where: { tenantId },
      relations: ['parentDepartment'],
      order: { name: 'ASC' },
    });
  }

  async findDepartmentById(id: string, tenantId: string): Promise<Department> {
    const department = await this.departmentRepo.findOne({
      where: { id, tenantId },
      relations: ['parentDepartment'],
    });
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async updateDepartment(id: string, tenantId: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findDepartmentById(id, tenantId);
    Object.assign(department, dto);
    return this.departmentRepo.save(department);
  }

  async deleteDepartment(id: string, tenantId: string): Promise<void> {
    const department = await this.findDepartmentById(id, tenantId);
    
    const employeeCount = await this.employeeRepo.count({
      where: { departmentId: id, tenantId },
    });
    if (employeeCount > 0) {
      throw new BadRequestException('Cannot delete department with employees');
    }

    await this.departmentRepo.remove(department);
  }

  // ==================== EMPLOYEE METHODS ====================

  async createEmployee(tenantId: string, dto: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepo.findOne({
      where: { email: dto.email, tenantId },
    });
    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    const employee = this.employeeRepo.create({
      firstName: dto.firstName,
      middleName: dto.middleName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      phoneAlternate: dto.phoneAlternate,
      nationalId: dto.nationalId,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      maritalStatus: dto.maritalStatus,
      nationality: dto.nationality,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      postalCode: dto.postalCode,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      emergencyContactRelation: dto.emergencyContactRelation,
      profileImage: dto.profileImage,
      departmentId: dto.departmentId,
      positionId: dto.positionId,
      jobTitle: dto.jobTitle,
      yearsOfExperience: dto.yearsOfExperience,
      salary: dto.salary,
      employmentType: dto.employmentType,
      contractType: dto.contractType,
      payrollFrequency: dto.payrollFrequency,
      hireDate: dto.hireDate,
      contractStartDate: dto.contractStartDate,
      contractEndDate: dto.contractEndDate,
      reportsToId: dto.reportsToId,
      userId: dto.userId,
      bankDetails: dto.bankDetails,
      taxInfo: dto.taxInfo,
      socialSecurity: dto.socialSecurity,
      tenantId,
      status: dto.status || EmployeeStatus.PROBATION,
    });
    
    const savedEmployee = await this.employeeRepo.save(employee);

    await this.initializeLeaveBalances(tenantId, savedEmployee.id);

    return savedEmployee;
  }

  private async initializeLeaveBalances(tenantId: string, employeeId: string): Promise<void> {
    const defaultBalances = [
      { leaveType: LeaveType.ANNUAL, days: 20 },
      { leaveType: LeaveType.SICK, days: 10 },
      { leaveType: LeaveType.PERSONAL, days: 5 },
    ];

    const year = new Date().getFullYear();

    for (const balance of defaultBalances) {
      const leaveBalance = this.leaveBalanceRepo.create({
        employeeId,
        tenantId,
        leaveType: balance.leaveType,
        totalDays: balance.days,
        usedDays: 0,
        pendingDays: 0,
        balanceDays: balance.days,
        year,
      });
      await this.leaveBalanceRepo.save(leaveBalance);
    }
  }

  async findAllEmployees(tenantId: string, query: EmployeeSearchDto): Promise<{ data: Employee[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, departmentId, status, employmentType } = query;

    const queryBuilder = this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.reportsTo', 'reportsTo')
      .where('employee.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(employee.firstName LIKE :search OR employee.lastName LIKE :search OR employee.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (departmentId) {
      queryBuilder.andWhere('employee.departmentId = :departmentId', { departmentId });
    }

    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status });
    }

    if (employmentType) {
      queryBuilder.andWhere('employee.employmentType = :employmentType', { employmentType });
    }

    queryBuilder
      .orderBy('employee.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findEmployeeById(id: string, tenantId: string): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id, tenantId },
      relations: ['department', 'reportsTo'],
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async updateEmployee(id: string, tenantId: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findEmployeeById(id, tenantId);
    Object.assign(employee, dto);
    return this.employeeRepo.save(employee);
  }

  async deleteEmployee(id: string, tenantId: string): Promise<void> {
    const employee = await this.findEmployeeById(id, tenantId);
    employee.status = EmployeeStatus.TERMINATED;
    employee.terminationDate = new Date();
    await this.employeeRepo.save(employee);
  }

  async terminateEmployee(id: string, tenantId: string, terminationDate: Date): Promise<Employee> {
    const employee = await this.findEmployeeById(id, tenantId);
    employee.status = EmployeeStatus.TERMINATED;
    employee.terminationDate = terminationDate;
    return this.employeeRepo.save(employee);
  }

  // ==================== LEAVE REQUEST METHODS ====================

  async createLeaveRequest(tenantId: string, dto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const employee = await this.findEmployeeById(dto.employeeId, tenantId);

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const leaveBalance = await this.leaveBalanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        leaveType: dto.leaveType,
        year: startDate.getFullYear(),
      },
    });

    if (leaveBalance && leaveBalance.balanceDays < totalDays) {
      throw new BadRequestException('Insufficient leave balance');
    }

    const leaveRequest = this.leaveRequestRepo.create({
      ...dto,
      tenantId,
      totalDays,
    });

    if (leaveBalance) {
      leaveBalance.pendingDays += totalDays;
      leaveBalance.balanceDays -= totalDays;
      await this.leaveBalanceRepo.save(leaveBalance);
    }

    return this.leaveRequestRepo.save(leaveRequest);
  }

  async findAllLeaveRequests(tenantId: string, query: LeaveRequestSearchDto): Promise<{ data: LeaveRequest[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, employeeId, leaveType, status } = query;

    const queryBuilder = this.leaveRequestRepo
      .createQueryBuilder('leaveRequest')
      .leftJoinAndSelect('leaveRequest.employee', 'employee')
      .where('leaveRequest.tenantId = :tenantId', { tenantId });

    if (employeeId) {
      queryBuilder.andWhere('leaveRequest.employeeId = :employeeId', { employeeId });
    }

    if (leaveType) {
      queryBuilder.andWhere('leaveRequest.leaveType = :leaveType', { leaveType });
    }

    if (status) {
      queryBuilder.andWhere('leaveRequest.status = :status', { status });
    }

    queryBuilder
      .orderBy('leaveRequest.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async approveLeaveRequest(id: string, tenantId: string, approverId: string, dto: ApproveLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepo.findOne({
      where: { id, tenantId },
      relations: ['employee'],
    });

    if (!leaveRequest) throw new NotFoundException('Leave request not found');

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request has already been processed');
    }

    leaveRequest.status = dto.status;
    leaveRequest.approverId = approverId;
    leaveRequest.approvedAt = new Date();

    if (dto.status === LeaveStatus.REJECTED) {
      leaveRequest.rejectionReason = dto.rejectionReason;
      
      const leaveBalance = await this.leaveBalanceRepo.findOne({
        where: {
          employeeId: leaveRequest.employeeId,
          leaveType: leaveRequest.leaveType,
          year: new Date(leaveRequest.startDate).getFullYear(),
        },
      });

      if (leaveBalance) {
        leaveBalance.pendingDays -= leaveRequest.totalDays;
        leaveBalance.balanceDays += leaveRequest.totalDays;
        await this.leaveBalanceRepo.save(leaveBalance);
      }
    } else if (dto.status === LeaveStatus.APPROVED) {
      const leaveBalance = await this.leaveBalanceRepo.findOne({
        where: {
          employeeId: leaveRequest.employeeId,
          leaveType: leaveRequest.leaveType,
          year: new Date(leaveRequest.startDate).getFullYear(),
        },
      });

      if (leaveBalance) {
        leaveBalance.usedDays += leaveRequest.totalDays;
        leaveBalance.pendingDays -= leaveRequest.totalDays;
        await this.leaveBalanceRepo.save(leaveBalance);
      }
    }

    return this.leaveRequestRepo.save(leaveRequest);
  }

  // ==================== LEAVE BALANCE METHODS ====================

  async createLeaveBalance(tenantId: string, dto: CreateLeaveBalanceDto): Promise<LeaveBalance> {
    const year = dto.year || new Date().getFullYear();

    const existingBalance = await this.leaveBalanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        leaveType: dto.leaveType,
        year,
      },
    });

    if (existingBalance) {
      throw new ConflictException('Leave balance already exists for this year');
    }

    const leaveBalance = this.leaveBalanceRepo.create({
      ...dto,
      tenantId,
      year,
      usedDays: 0,
      pendingDays: 0,
      balanceDays: dto.totalDays,
    });

    return this.leaveBalanceRepo.save(leaveBalance);
  }

  async findLeaveBalances(tenantId: string, employeeId: string, year?: number): Promise<LeaveBalance[]> {
    const where: FindOptionsWhere<LeaveBalance> = { employeeId, tenantId };
    if (year) where.year = year;

    return this.leaveBalanceRepo.find({
      where,
      order: { leaveType: 'ASC' },
    });
  }

  // ==================== ATTENDANCE METHODS ====================

  async createAttendanceRecord(tenantId: string, dto: CreateAttendanceRecordDto): Promise<AttendanceRecord> {
    const existingRecord = await this.attendanceRepo.findOne({
      where: {
        employeeId: dto.employeeId,
        date: dto.date,
        tenantId,
      },
    });

    if (existingRecord) {
      throw new ConflictException('Attendance record already exists for this date');
    }

    let hoursWorked = 0;
    if (dto.checkIn && dto.checkOut) {
      const checkIn = new Date(dto.checkIn);
      const checkOut = new Date(dto.checkOut);
      hoursWorked = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }

    const attendance = this.attendanceRepo.create({
      ...dto,
      tenantId,
      hoursWorked: Math.round(hoursWorked * 100) / 100,
    });

    return this.attendanceRepo.save(attendance);
  }

  async findAttendanceRecords(tenantId: string, query: AttendanceSearchDto): Promise<{ data: AttendanceRecord[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, employeeId, startDate, endDate } = query;

    const queryBuilder = this.attendanceRepo
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .where('attendance.tenantId = :tenantId', { tenantId });

    if (employeeId) {
      queryBuilder.andWhere('attendance.employeeId = :employeeId', { employeeId });
    }

    queryBuilder
      .orderBy('attendance.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(tenantId: string): Promise<any> {
    const totalEmployees = await this.employeeRepo.count({
      where: { tenantId, status: EmployeeStatus.ACTIVE },
    });

    const onLeave = await this.employeeRepo.count({
      where: { tenantId, status: EmployeeStatus.ON_LEAVE },
    });

    const pendingLeaveRequests = await this.leaveRequestRepo.count({
      where: { tenantId, status: LeaveStatus.PENDING },
    });

    const departments = await this.departmentRepo.count({
      where: { tenantId, isActive: true },
    });

    return {
      totalEmployees,
      onLeave,
      pendingLeaveRequests,
      departments,
    };
  }

  // Legacy methods for compatibility
  async getEmployees() {
    return this.employeeRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getEmployee(id: string) {
    return this.employeeRepo.findOne({ where: { id } });
  }

  async createEmployeeLegacy(data: any) {
    const employee = this.employeeRepo.create(data);
    return this.employeeRepo.save(employee);
  }

  async updateEmployeeLegacy(id: string, data: any) {
    await this.employeeRepo.update(id, data);
    return this.getEmployee(id);
  }

  async deleteEmployeeLegacy(id: string) {
    return this.employeeRepo.delete(id);
  }

  async getLeaveRequests(employeeId?: string) {
    const where = employeeId ? { employeeId } : {};
    return this.leaveRequestRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async createLeaveRequestLegacy(data: any) {
    const leave = this.leaveRequestRepo.create(data);
    return this.leaveRequestRepo.save(leave);
  }

  async updateLeaveRequestLegacy(id: string, data: any) {
    await this.leaveRequestRepo.update(id, data);
    return this.leaveRequestRepo.findOne({ where: { id } });
  }

  async getLeaveStats() {
    const pending = await this.leaveRequestRepo.count({ where: { status: LeaveStatus.PENDING } });
    const approved = await this.leaveRequestRepo.count({ where: { status: LeaveStatus.APPROVED } });
    const rejected = await this.leaveRequestRepo.count({ where: { status: LeaveStatus.REJECTED } });
    return { pending, approved, rejected };
  }
}
