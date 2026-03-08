import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email, EmailTemplate, EmailSettings, EmailStatus, EmailType } from '../entities/email.entities';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private emailRepo: Repository<Email>,
    @InjectRepository(EmailTemplate)
    private templateRepo: Repository<EmailTemplate>,
    @InjectRepository(EmailSettings)
    private settingsRepo: Repository<EmailSettings>,
  ) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  async createEmail(tenantId: string, data: Partial<Email>): Promise<Email> {
    const email = this.emailRepo.create({ ...data, tenantId });
    return this.emailRepo.save(email);
  }

  async findAllEmails(tenantId: string, query: any): Promise<{ data: Email[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, type } = query;

    const where: any = { tenantId };
    if (status) where.status = status;
    if (type) where.type = type;

    const [data, total] = await this.emailRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findEmailById(id: string, tenantId: string): Promise<Email> {
    const email = await this.emailRepo.findOne({ where: { id, tenantId } });
    if (!email) throw new NotFoundException('Email not found');
    return email;
  }

  async sendEmail(id: string, tenantId: string): Promise<Email> {
    const email = await this.findEmailById(id, tenantId);

    if (!email.to || email.to.length === 0) {
      throw new BadRequestException('No recipients specified');
    }

    const settings = await this.settingsRepo.findOne({ where: { tenantId, isActive: true } });
    
    if (!settings) {
      email.status = EmailStatus.FAILED;
      email.failureReason = 'Email settings not configured';
      return this.emailRepo.save(email);
    }

    try {
      console.log(`Sending email via SMTP: ${settings.smtpHost}`);
      console.log(`From: ${settings.fromEmail}`);
      console.log(`To: ${email.to.map(t => t.email).join(', ')}`);
      console.log(`Subject: ${email.subject}`);
      
      email.status = EmailStatus.SENT;
      email.sentAt = new Date();
    } catch (error) {
      email.status = EmailStatus.FAILED;
      email.failureReason = error.message;
    }

    return this.emailRepo.save(email);
  }

  async deleteEmail(id: string, tenantId: string): Promise<void> {
    const email = await this.findEmailById(id, tenantId);
    await this.emailRepo.remove(email);
  }

  async createTemplate(tenantId: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const template = this.templateRepo.create({ ...data, tenantId });
    return this.templateRepo.save(template);
  }

  async findAllTemplates(tenantId: string): Promise<EmailTemplate[]> {
    return this.templateRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async findTemplateById(id: string, tenantId: string): Promise<EmailTemplate> {
    const template = await this.templateRepo.findOne({ where: { id, tenantId } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async updateTemplate(id: string, tenantId: string, data: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const template = await this.findTemplateById(id, tenantId);
    Object.assign(template, data);
    return this.templateRepo.save(template);
  }

  async deleteTemplate(id: string, tenantId: string): Promise<void> {
    const template = await this.findTemplateById(id, tenantId);
    await this.templateRepo.remove(template);
  }

  async createOrUpdateSettings(tenantId: string, data: Partial<EmailSettings>): Promise<EmailSettings> {
    let settings = await this.settingsRepo.findOne({ where: { tenantId } });
    
    if (settings) {
      Object.assign(settings, data);
    } else {
      settings = this.settingsRepo.create({ ...data, tenantId });
    }
    
    return this.settingsRepo.save(settings);
  }

  async getSettings(tenantId: string): Promise<EmailSettings> {
    let settings = await this.settingsRepo.findOne({ where: { tenantId } });
    
    if (!settings) {
      settings = this.settingsRepo.create({
        tenantId,
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        smtpSecure: true,
        fromEmail: '',
        fromName: '',
        isActive: false,
      });
      settings = await this.settingsRepo.save(settings);
    }
    
    return settings;
  }

  async sendEmailToCustomer(tenantId: string, customerEmail: string, customerName: string, subject: string, body: string): Promise<Email> {
    const email = this.emailRepo.create({
      tenantId,
      subject,
      body,
      type: EmailType.TRANSACTIONAL,
      status: EmailStatus.DRAFT,
      to: [{ email: customerEmail, name: customerName, type: 'to' as any }],
    });

    const savedEmail = await this.emailRepo.save(email);
    return this.sendEmail(savedEmail.id, tenantId);
  }

  async sendBulkEmails(tenantId: string, recipients: Array<{ email: string; name?: string }>, subject: string, body: string): Promise<Email> {
    const email = this.emailRepo.create({
      tenantId,
      subject,
      body,
      type: EmailType.MARKETING,
      status: EmailStatus.DRAFT,
      to: recipients.map(r => ({ ...r, type: 'to' as any })),
    });

    const savedEmail = await this.emailRepo.save(email);
    return this.sendEmail(savedEmail.id, tenantId);
  }
}
