import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from '../services/email.service';

@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEmail(@Body() data: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.createEmail(tenantId, data) };
  }

  @Get()
  async findAllEmails(@Query() query: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.emailService.findAllEmails(tenantId, query);
  }

  @Get(':id')
  async findEmail(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.findEmailById(id, tenantId) };
  }

  @Post(':id/send')
  async sendEmail(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.sendEmail(id, tenantId) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEmail(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.emailService.deleteEmail(id, tenantId);
    return { success: true };
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async sendBulkEmails(@Body() data: { recipients: Array<{ email: string; name?: string }>; subject: string; body: string }, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.sendBulkEmails(tenantId, data.recipients, data.subject, data.body) };
  }

  @Post('to-customer')
  @HttpCode(HttpStatus.CREATED)
  async sendToCustomer(@Body() data: { customerEmail: string; customerName: string; subject: string; body: string }, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.sendEmailToCustomer(tenantId, data.customerEmail, data.customerName, data.subject, data.body) };
  }

  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  async createTemplate(@Body() data: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.createTemplate(tenantId, data) };
  }

  @Get('templates')
  async findAllTemplates(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.findAllTemplates(tenantId) };
  }

  @Get('templates/:id')
  async findTemplate(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.findTemplateById(id, tenantId) };
  }

  @Put('templates/:id')
  async updateTemplate(@Param('id') id: string, @Body() data: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.updateTemplate(id, tenantId, data) };
  }

  @Delete('templates/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTemplate(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.emailService.deleteTemplate(id, tenantId);
    return { success: true };
  }

  @Get('settings')
  async getSettings(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.getSettings(tenantId) };
  }

  @Put('settings')
  async updateSettings(@Body() data: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.emailService.createOrUpdateSettings(tenantId, data) };
  }
}
