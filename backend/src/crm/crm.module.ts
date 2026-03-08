import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './controllers/crm.controller';
import { CrmService } from './services/crm.service';
import { Company, Contact, Lead, Deal, Activity } from './entities/crm.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Contact, Lead, Deal, Activity])],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
