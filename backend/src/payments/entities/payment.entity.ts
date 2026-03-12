import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum PaymentMethod {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  PAYFLEX = 'payflex',
  PAYJUSTNOW = 'payjustnow',
  ECOCASH = 'ecocash',
  PAYPAL = 'paypal',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum Currency {
  ZAR = 'ZAR',
  BWP = 'BWP',
  USD = 'USD',
  EUR = 'EUR',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: Currency, default: Currency.ZAR })
  currency: Currency;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  plan: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  externalReference: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
