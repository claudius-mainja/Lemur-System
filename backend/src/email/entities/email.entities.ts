import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum EmailStatus {
  DRAFT = 'draft',
  QUEUED = 'queued',
  SENT = 'sent',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum EmailType {
  TRANSACTIONAL = 'transactional',
  MARKETING = 'marketing',
  NOTIFICATION = 'notification',
  INVOICE = 'invoice',
  QUOTATION = 'quotation',
  PAYROLL = 'payroll',
  CUSTOM = 'custom',
}

export enum RecipientType {
  TO = 'to',
  CC = 'cc',
  BCC = 'bcc',
}

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'jsonb', nullable: true })
  variables: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'enum', enum: EmailType, default: EmailType.CUSTOM })
  type: EmailType;

  @Column({ type: 'enum', enum: EmailStatus, default: EmailStatus.DRAFT })
  status: EmailStatus;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ type: 'jsonb', default: [] })
  to: Array<{
    email: string;
    name?: string;
    type: RecipientType;
  }>;

  @Column({ type: 'jsonb', default: [] })
  cc: Array<{
    email: string;
    name?: string;
  }>;

  @Column({ type: 'jsonb', default: [] })
  bcc: Array<{
    email: string;
    name?: string;
  }>;

  @ManyToOne(() => EmailTemplate, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: EmailTemplate;

  @Column({ nullable: true })
  templateId: string;

  @Column({ nullable: true })
  relatedEntityType: string;

  @Column({ nullable: true })
  relatedEntityId: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('email_settings')
export class EmailSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column()
  smtpHost: string;

  @Column()
  smtpPort: number;

  @Column()
  smtpUser: string;

  @Column()
  smtpPassword: string;

  @Column({ default: true })
  smtpSecure: boolean;

  @Column()
  fromEmail: string;

  @Column({ nullable: true })
  fromName: string;

  @Column({ nullable: true })
  replyTo: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
