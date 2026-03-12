import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService, PAYMENT_METHODS, PLAN_PRICES } from '../services/payments.service';
import { PaymentMethod, Currency } from '../entities/payment.entity';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('methods')
  getPaymentMethods() {
    return this.paymentsService.getPaymentMethods();
  }

  @Get('plans')
  getPlanPrices() {
    return this.paymentsService.getPlanPrices();
  }

  @Post('checkout')
  async initiateCheckout(
    @Request() req,
    @Body() body: {
      plan: string;
      billingCycle: 'monthly' | 'annual';
      paymentMethod: PaymentMethod;
    },
  ) {
    return this.paymentsService.initiateCheckout({
      tenantId: req.user.organizationId,
      userId: req.user.sub,
      plan: body.plan,
      billingCycle: body.billingCycle,
      paymentMethod: body.paymentMethod,
    });
  }

  @Get('history')
  async getPaymentHistory(@Request() req) {
    return this.paymentsService.getPaymentsByTenant(req.user.organizationId);
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentsService.getPaymentStatus(id);
  }

  @Post(':id/refund')
  async refundPayment(@Param('id') id: string) {
    return { message: 'Refund initiated', paymentId: id };
  }
}
