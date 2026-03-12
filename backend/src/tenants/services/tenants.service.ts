import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Tenant, SubscriptionPlan } from '../entities/tenant.entity';
import { User } from '../../auth/entities/user.entity';

export const SADC_COUNTRIES = [
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', timezone: 'Africa/Johannesburg' },
  { code: 'BW', name: 'Botswana', currency: 'BWP', currencySymbol: 'P', timezone: 'Africa/Gaborone' },
  { code: 'SZ', name: 'Eswatini', currency: 'SZL', currencySymbol: 'E', timezone: 'Africa/Mbabane' },
  { code: 'LS', name: 'Lesotho', currency: 'LSL', currencySymbol: 'L', timezone: 'Africa/Maseru' },
  { code: 'NA', name: 'Namibia', currency: 'NAD', currencySymbol: '$', timezone: 'Africa/Windhoek' },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', timezone: 'Africa/Lusaka' },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', currencySymbol: '$', timezone: 'Africa/Harare' },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT', timezone: 'Africa/Maputo' },
  { code: 'MW', name: 'Malawi', currency: 'MWK', currencySymbol: 'MK', timezone: 'Africa/Blantyre' },
  { code: 'AO', name: 'Angola', currency: 'AOA', currencySymbol: 'Kz', timezone: 'Africa/Luanda' },
  { code: 'CD', name: 'Democratic Republic of Congo', currency: 'CDF', currencySymbol: 'FC', timezone: 'Africa/Kinshasa' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', timezone: 'Africa/Dar_es_Salaam' },
  { code: 'MU', name: 'Mauritius', currency: 'MUR', currencySymbol: '₨', timezone: 'Indian/Mauritius' },
  { code: 'SC', name: 'Seychelles', currency: 'SCR', currencySymbol: '₨', timezone: 'Indian/Mahe' },
  { code: 'MG', name: 'Madagascar', currency: 'MGA', currencySymbol: 'Ar', timezone: 'Indian/Antananarivo' },
];

export const CURRENCY_MAP: Record<string, { symbol: string; name: string }> = {
  ZAR: { symbol: 'R', name: 'South African Rand' },
  BWP: { symbol: 'P', name: 'Botswana Pula' },
  SZL: { symbol: 'E', name: 'Swazi Lilangeni' },
  LSL: { symbol: 'L', name: 'Lesotho Loti' },
  NAD: { symbol: '$', name: 'Namibian Dollar' },
  ZMW: { symbol: 'ZK', name: 'Zambian Kwacha' },
  ZWL: { symbol: '$', name: 'Zimbabwean Dollar' },
  MZN: { symbol: 'MT', name: 'Mozambican Metical' },
  MWK: { symbol: 'MK', name: 'Malawian Kwacha' },
  AOA: { symbol: 'Kz', name: 'Angolan Kwanza' },
  CDF: { symbol: 'FC', name: 'Congolese Franc' },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling' },
  MUR: { symbol: '₨', name: 'Mauritian Rupee' },
  SCR: { symbol: '₨', name: 'Seychellois Rupee' },
  MGA: { symbol: 'Ar', name: 'Malagasy Ariary' },
};

const PLAN_MODULES: Record<SubscriptionPlan, string[]> = {
  [SubscriptionPlan.STARTER]: ['hr', 'finance', 'supply-chain'],
  [SubscriptionPlan.PROFESSIONAL]: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain'],
  [SubscriptionPlan.ENTERPRISE]: ['hr', 'finance', 'crm', 'payroll', 'productivity', 'supply-chain', 'email', 'documents'],
};

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    country?: string;
  }) {
    const existingTenant = await this.tenantRepository.findOne({
      where: { email: data.email },
    });

    if (existingTenant) {
      throw new ConflictException('Organization with this email already exists');
    }

    const validPlans: SubscriptionPlan[] = [SubscriptionPlan.STARTER, SubscriptionPlan.PROFESSIONAL, SubscriptionPlan.ENTERPRISE];
    const selectedPlan: SubscriptionPlan = validPlans.includes(data.plan as SubscriptionPlan) ? data.plan as SubscriptionPlan : SubscriptionPlan.STARTER;
    const modules = PLAN_MODULES[selectedPlan] || PLAN_MODULES[SubscriptionPlan.STARTER];

    const tenant = this.tenantRepository.create({
      name: data.name,
      email: data.email,
      phone: '',
      address: '',
      city: '',
      country: data.country || 'ZA',
      status: 'active',
      timezone: data.timezone || 'Africa/Johannesburg',
      currency: data.currency || 'ZAR',
      language: data.language || 'en',
      plan: selectedPlan,
      modules,
      isOnTrial: true,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.tenantRepository.save(tenant);

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = this.userRepository.create({
      email: data.email,
      organizationId: tenant.id,
      passwordHash,
      firstName: data.firstName || 'Admin',
      lastName: data.lastName || 'User',
      role: 'admin',
      isActive: true,
    });

    await this.userRepository.save(user);

    const accessToken = this.generateToken(user, tenant);
    const refreshToken = this.generateRefreshToken(user);

    return {
      id: tenant.id,
      tenantId: tenant.id,
      userId: user.id,
      name: tenant.name,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: tenant.status,
      plan: tenant.plan,
      modules: tenant.modules,
      currency: tenant.currency,
      timezone: tenant.timezone,
      country: tenant.country,
      accessToken,
      refreshToken,
    };
  }

  private generateToken(user: User, tenant: Tenant): string {
    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: tenant.id,
      organizationName: tenant.name,
      role: user.role,
      plan: tenant.plan,
      modules: tenant.modules,
      industry: 'technology',
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });
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
    const tenant = await this.findById(id);
    const plan = tenant.plan || 'starter';
    const availableModules = PLAN_MODULES[plan] || PLAN_MODULES['starter'];
    const enabledModules = tenant.modules || availableModules;
    
    return {
      modules: availableModules.map(name => ({
        name,
        enabled: enabledModules.includes(name),
      })),
      plan,
    };
  }
}
