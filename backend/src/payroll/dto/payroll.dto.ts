import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsDate, IsUUID, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollStatus, SalaryComponentType } from '../entities/payroll.entities';

export class SalaryComponentDto {
  @IsString()
  name: string;

  @IsEnum(SalaryComponentType)
  type: SalaryComponentType;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsBoolean()
  @IsOptional()
  isTaxable?: boolean;

  @IsBoolean()
  @IsOptional()
  isFixed?: boolean;
}

export class CreateSalaryStructureDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  components: SalaryComponentDto[];
}

export class UpdateSalaryStructureDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  @IsOptional()
  components?: SalaryComponentDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateEmployeeSalaryDto {
  @IsUUID()
  employeeId: string;

  @IsString()
  employeeName: string;

  @IsString()
  @IsOptional()
  employeeEmail?: string;

  @IsUUID()
  @IsOptional()
  salaryStructureId?: string;

  @IsNumber()
  @Min(0)
  basicSalary: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  @IsOptional()
  earnings?: SalaryComponentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  @IsOptional()
  deductions?: SalaryComponentDto[];
}

export class UpdateEmployeeSalaryDto {
  @IsUUID()
  @IsOptional()
  salaryStructureId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basicSalary?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  @IsOptional()
  earnings?: SalaryComponentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryComponentDto)
  @IsOptional()
  deductions?: SalaryComponentDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class TaxBracketDto {
  @IsNumber()
  @Min(0)
  min: number;

  @IsNumber()
  @Min(0)
  max: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  fixed?: number;
}

export class CreateTaxConfigurationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxBracketDto)
  brackets: TaxBracketDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxExemption?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  socialSecurityRate?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  pensionRate?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  healthInsuranceRate?: number;
}

export class ProcessPayrollDto {
  @IsDate()
  @Type(() => Date)
  periodStart: Date;

  @IsDate()
  @Type(() => Date)
  periodEnd: Date;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ApprovePayrollDto {
  @IsString()
  @IsOptional()
  notes?: string;
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

export class PayrollSearchDto extends PaginationDto {
  @IsEnum(PayrollStatus)
  @IsOptional()
  status?: PayrollStatus;

  @IsNumber()
  @IsOptional()
  month?: number;

  @IsNumber()
  @IsOptional()
  year?: number;
}
