import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum PayrollStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum SalaryComponentType {
  BASIC = 'basic',
  ALLOWANCE = 'allowance',
  BONUS = 'bonus',
  DEDUCTION = 'deduction',
  OVERTIME = 'overtime',
}

@Entity('salary_structures')
export class SalaryStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'jsonb', default: [] })
  components: Array<{
    id: string;
    name: string;
    type: SalaryComponentType;
    amount: number;
    isTaxable: boolean;
    isFixed: boolean;
  }>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('employee_salaries')
export class EmployeeSalary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @Column()
  employeeName: string;

  @Column({ nullable: true })
  employeeEmail: string;

  @ManyToOne(() => SalaryStructure)
  @JoinColumn({ name: 'salaryStructureId' })
  salaryStructure: SalaryStructure;

  @Column({ nullable: true })
  salaryStructureId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  grossSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netSalary: number;

  @Column({ type: 'jsonb', default: [] })
  earnings: Array<{
    name: string;
    type: SalaryComponentType;
    amount: number;
    isTaxable: boolean;
  }>;

  @Column({ type: 'jsonb', default: [] })
  deductions: Array<{
    name: string;
    type: SalaryComponentType;
    amount: number;
  }>;

  @Column({ type: 'jsonb', default: [] })
  taxes: Array<{
    name: string;
    amount: number;
    rate: number;
  }>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('payroll_runs')
export class PayrollRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  payrollNumber: string;

  @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.DRAFT })
  status: PayrollStatus;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'int' })
  month: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'jsonb', default: [] })
  employeePayslips: Array<{
    employeeId: string;
    employeeName: string;
    basicSalary: number;
    grossSalary: number;
    netSalary: number;
    totalEarnings: number;
    totalDeductions: number;
    totalTax: number;
    status: PayrollStatus;
    bankName?: string;
    accountNumber?: string;
  }>;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalGross: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalNet: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalTax: number;

  @Column({ type: 'int', default: 0 })
  employeeCount: number;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'date', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('payslips')
export class Payslip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  payslipNumber: string;

  @ManyToOne(() => PayrollRun)
  @JoinColumn({ name: 'payrollRunId' })
  payrollRun: PayrollRun;

  @Column()
  payrollRunId: string;

  @Column()
  employeeId: string;

  @Column()
  employeeName: string;

  @Column({ nullable: true })
  employeeEmail: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  grossSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  netSalary: number;

  @Column({ type: 'jsonb', default: [] })
  earnings: Array<{
    name: string;
    type: string;
    amount: number;
  }>;

  @Column({ type: 'jsonb', default: [] })
  deductions: Array<{
    name: string;
    amount: number;
  }>;

  @Column({ type: 'jsonb', default: [] })
  taxes: Array<{
    name: string;
    amount: number;
    rate: number;
  }>;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalTax: number;

  @Column({ type: 'jsonb', nullable: true })
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  workingDays: {
    total: number;
    worked: number;
    leaves: number;
    absences: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('tax_configurations')
export class TaxConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'jsonb', default: [] })
  brackets: Array<{
    min: number;
    max: number;
    rate: number;
    fixed: number;
  }>;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxExemption: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  socialSecurityRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  pensionRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  healthInsuranceRate: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
