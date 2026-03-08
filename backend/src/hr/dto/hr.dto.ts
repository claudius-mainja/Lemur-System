import { IsString, IsEmail, IsOptional, IsDate, IsEnum, IsNumber, IsBoolean, IsObject, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeStatus, EmploymentType, ContractType, PayrollFrequency, LeaveType, LeaveStatus } from '../entities/hr.entities';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsUUID()
  @IsOptional()
  parentDepartmentId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDepartmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsUUID()
  @IsOptional()
  parentDepartmentId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  phoneAlternate?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  emergencyContactRelation?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsUUID()
  @IsOptional()
  positionId?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  yearsOfExperience?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salary?: number;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @IsEnum(PayrollFrequency)
  @IsOptional()
  payrollFrequency?: PayrollFrequency;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  hireDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  contractStartDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  contractEndDate?: Date;

  @IsUUID()
  @IsOptional()
  reportsToId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsObject()
  @IsOptional()
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    routingNumber?: string;
    branchCode?: string;
  };

  @IsObject()
  @IsOptional()
  taxInfo?: {
    taxId: string;
    taxType: string;
    taxExemptions?: number;
  };

  @IsObject()
  @IsOptional()
  socialSecurity?: {
    number: string;
    provider?: string;
  };

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;
}

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  phoneAlternate?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  emergencyContactRelation?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salary?: number;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  hireDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  terminationDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  contractStartDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  contractEndDate?: Date;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsBoolean()
  @IsOptional()
  isManager?: boolean;

  @IsUUID()
  @IsOptional()
  reportsToId?: string;

  @IsObject()
  @IsOptional()
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    routingNumber?: string;
    branchCode?: string;
  };

  @IsObject()
  @IsOptional()
  taxInfo?: {
    taxId: string;
    taxType: string;
    taxExemptions?: number;
  };

  @IsObject()
  @IsOptional()
  socialSecurity?: {
    number: string;
    provider?: string;
  };
}

export class CreateLeaveRequestDto {
  @IsUUID()
  employeeId: string;

  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  attachment?: string;
}

export class UpdateLeaveRequestDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  attachment?: string;
}

export class ApproveLeaveRequestDto {
  @IsEnum(LeaveStatus)
  status: LeaveStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateLeaveBalanceDto {
  @IsUUID()
  employeeId: string;

  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsNumber()
  @Min(0)
  @Max(365)
  totalDays: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  year?: number;
}

export class UpdateLeaveBalanceDto {
  @IsNumber()
  @Min(0)
  @Max(365)
  @IsOptional()
  totalDays?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  usedDays?: number;
}

export class CreateAttendanceRecordDto {
  @IsUUID()
  employeeId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  checkIn?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  checkOut?: Date;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  location?: string;
}

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}

export class EmployeeSearchDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;
}

export class LeaveRequestSearchDto extends PaginationDto {
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @IsEnum(LeaveType)
  @IsOptional()
  leaveType?: LeaveType;

  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}

export class AttendanceSearchDto extends PaginationDto {
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}
