import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentMethod, PaymentStatus, Currency } from '../entities/payment.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export const PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  starter: { monthly: 299, annual: 2990 },
  professional: { monthly: 599, annual: 5990 },
  enterprise: { monthly: 1299, annual: 12990 },
};

export const PAYMENT_METHODS = [
  { id: 'visa', name: 'Visa', type: 'card', icon: '💳' },
  { id: 'mastercard', name: 'Mastercard', type: 'card', icon: '💳' },
  { id: 'payflex', name: 'PayFlex', type: 'installment', icon: '💰' },
  { id: 'payjustnow', name: 'PayJustNow', type: 'installment', icon: '💰' },
  { id: 'ecocash', name: 'Ecocash', type: 'mobile_money', icon: '📱' },
  { id: 'paypal', name: 'PayPal', type: 'digital_wallet', icon: '🅿️' },
];

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly configService: ConfigService,
  ) {}

  async createPayment(data: {
    tenantId: string;
    userId: string;
    amount: number;
    currency?: Currency;
    paymentMethod: PaymentMethod;
    plan: string;
    billingCycle?: 'monthly' | 'annual';
  }) {
    const tenant = await this.tenantRepository.findOne({ where: { id: data.tenantId } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const payment = this.paymentRepository.create({
      tenantId: data.tenantId,
      userId: data.userId,
      amount: data.amount,
      currency: data.currency || Currency.ZAR,
      paymentMethod: data.paymentMethod,
      plan: data.plan,
      status: PaymentStatus.PENDING,
      description: `${data.plan} plan - ${data.billingCycle || 'monthly'} subscription`,
      metadata: {
        billingCycle: data.billingCycle || 'monthly',
      },
    });

    const savedPayment = await this.paymentRepository.save(payment);
    
    const processedPayment = await this.processPayment(savedPayment, data.paymentMethod);
    
    return processedPayment;
  }

  private async processPayment(payment: Payment, method: PaymentMethod): Promise<Payment> {
    payment.status = PaymentStatus.PROCESSING;
    await this.paymentRepository.save(payment);

    let transactionId: string;
    
    switch (method) {
      case PaymentMethod.VISA:
      case PaymentMethod.MASTERCARD:
        transactionId = await this.processCardPayment(payment);
        break;
      case PaymentMethod.PAYFLEX:
        transactionId = await this.processPayFlexPayment(payment);
        break;
      case PaymentMethod.PAYJUSTNOW:
        transactionId = await this.processPayJustNowPayment(payment);
        break;
      case PaymentMethod.ECOCASH:
        transactionId = await this.processEcocashPayment(payment);
        break;
      case PaymentMethod.PAYPAL:
        transactionId = await this.processPayPalPayment(payment);
        break;
      default:
        throw new BadRequestException('Invalid payment method');
    }

    payment.transactionId = transactionId;
    payment.status = PaymentStatus.COMPLETED;
    payment.externalReference = `LEMUR-${Date.now()}-${payment.id.slice(0, 8)}`;
    
    await this.paymentRepository.save(payment);

    await this.tenantRepository.update(payment.tenantId, {
      isOnTrial: false,
      trialEndsAt: null,
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return payment;
  }

  private async processCardPayment(payment: Payment): Promise<string> {
    return `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async processPayFlexPayment(payment: Payment): Promise<string> {
    return `PF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async processPayJustNowPayment(payment: Payment): Promise<string> {
    return `PJN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async processEcocashPayment(payment: Payment): Promise<string> {
    return `EC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async processPayPalPayment(payment: Payment): Promise<string> {
    return `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getPaymentMethods() {
    return PAYMENT_METHODS;
  }

  async getPlanPrices() {
    return PLAN_PRICES;
  }

  async getPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async getPaymentsByTenant(tenantId: string) {
    return this.paymentRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentStatus(id: string) {
    const payment = await this.getPaymentById(id);
    return {
      id: payment.id,
      status: payment.status,
      transactionId: payment.transactionId,
      externalReference: payment.externalReference,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
    };
  }

  async initiateCheckout(data: {
    tenantId: string;
    userId: string;
    plan: string;
    billingCycle: 'monthly' | 'annual';
    paymentMethod: PaymentMethod;
  }) {
    const price = PLAN_PRICES[data.plan];
    if (!price) {
      throw new BadRequestException('Invalid plan');
    }

    const amount = data.billingCycle === 'annual' ? price.annual : price.monthly;

    const payment = await this.createPayment({
      tenantId: data.tenantId,
      userId: data.userId,
      amount,
      paymentMethod: data.paymentMethod,
      plan: data.plan,
      billingCycle: data.billingCycle,
    });

    return {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      checkoutUrl: `${this.configService.get('NEXT_PUBLIC_APP_URL')}/checkout/${payment.id}/complete`,
    };
  }
}
