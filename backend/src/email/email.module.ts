import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { Email, EmailTemplate, EmailSettings } from './entities/email.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Email, EmailTemplate, EmailSettings])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
