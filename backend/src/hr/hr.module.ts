import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrController } from './controllers/hr.controller';
import { HrService } from './services/hr.service';
import { Employee, Department, Position, LeaveRequest, LeaveBalance, AttendanceRecord } from './entities/hr.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, Position, LeaveRequest, LeaveBalance, AttendanceRecord])],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
