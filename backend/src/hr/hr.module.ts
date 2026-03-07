import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrController } from './controllers/hr.controller';
import { HrService } from './services/hr.service';
import { Employee } from './entities/employee.entity';
import { LeaveRequest } from './entities/leave-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, LeaveRequest])],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
