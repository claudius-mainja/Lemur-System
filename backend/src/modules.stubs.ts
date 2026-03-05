import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [],
  exports: [],
})
export class PayrollModule {}

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [],
  exports: [],
})
export class FinanceModule {}

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProductivityModule {}

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SupplyChainModule {}

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
