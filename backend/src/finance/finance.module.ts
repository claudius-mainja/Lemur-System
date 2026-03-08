import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './controllers/finance.controller';
import { FinanceService } from './services/finance.service';
import { Account, Invoice, Payment, Expense, Transaction } from './entities/finance.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Invoice, Payment, Expense, Transaction])],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
