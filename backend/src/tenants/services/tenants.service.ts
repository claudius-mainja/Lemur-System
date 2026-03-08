import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    timezone?: string;
    currency?: string;
    language?: string;
    plan?: string;
  }) {
    const existingTenant = await this.tenantRepository.findOne({
      where: { email: data.email },
    });

    if (existingTenant) {
      throw new ConflictException('Organization with this email already exists');
    }

    const validPlans = ['starter', 'professional', 'enterprise'];
    const selectedPlan = validPlans.includes(data.plan) ? data.plan : 'starter';

    const tenant = this.tenantRepository.create({
      name: data.name,
      email: data.email,
      phone: '',
      address: '',
      city: '',
      country: '',
      status: 'active',
      timezone: data.timezone || 'Africa/Johannesburg',
      currency: data.currency || 'ZAR',
      language: data.language || 'en',
      plan: selectedPlan,
      isOnTrial: true,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await this.tenantRepository.save(tenant);

    return {
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      status: tenant.status,
      plan: tenant.plan,
    };
  }

  async findAll() {
    return this.tenantRepository.find();
  }

  async findById(id: string) {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async update(id: string, data: Partial<Tenant>) {
    await this.tenantRepository.update(id, data);
    return this.findById(id);
  }

  async getSettings(id: string) {
    const tenant = await this.findById(id);
    return {
      timezone: tenant.timezone,
      currency: tenant.currency,
      language: tenant.language,
    };
  }

  async getModules(id: string) {
    return {
      modules: [
        { name: 'HR', enabled: true },
        { name: 'Payroll', enabled: true },
        { name: 'Finance', enabled: true },
        { name: 'Supply Chain', enabled: true },
        { name: 'CRM', enabled: true },
      ],
    };
  }
}
