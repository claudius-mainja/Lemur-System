import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './controllers/payroll.controller';
import { PayrollService } from './services/payroll.service';
import { SalaryStructure, EmployeeSalary, PayrollRun, Payslip, TaxConfiguration } from './entities/payroll.entities';

@Module({
  imports: [TypeOrmModule.forFeature([SalaryStructure, EmployeeSalary, PayrollRun, Payslip, TaxConfiguration])],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
