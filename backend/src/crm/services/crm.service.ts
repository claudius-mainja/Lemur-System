import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Company, Contact, Lead, Deal, Activity, LeadStatus, DealStage, ContactType } from '../entities/crm.entities';
import { 
  CreateCompanyDto, UpdateCompanyDto,
  CreateContactDto, UpdateContactDto,
  CreateLeadDto, UpdateLeadDto,
  CreateDealDto, UpdateDealDto,
  CreateActivityDto, UpdateActivityDto,
  LeadSearchDto, DealSearchDto, ContactSearchDto
} from '../dto/crm.dto';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
    @InjectRepository(Lead)
    private leadRepo: Repository<Lead>,
    @InjectRepository(Deal)
    private dealRepo: Repository<Deal>,
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
  ) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== COMPANY METHODS ====================

  async createCompany(tenantId: string, dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepo.create({ ...dto, tenantId });
    return this.companyRepo.save(company);
  }

  async findAllCompanies(tenantId: string): Promise<Company[]> {
    return this.companyRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async findCompanyById(id: string, tenantId: string): Promise<Company> {
    const company = await this.companyRepo.findOne({ where: { id, tenantId } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async updateCompany(id: string, tenantId: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findCompanyById(id, tenantId);
    Object.assign(company, dto);
    return this.companyRepo.save(company);
  }

  async deleteCompany(id: string, tenantId: string): Promise<void> {
    const company = await this.findCompanyById(id, tenantId);
    await this.companyRepo.remove(company);
  }

  // ==================== CONTACT METHODS ====================

  async createContact(tenantId: string, dto: CreateContactDto): Promise<Contact> {
    const existingContact = await this.contactRepo.findOne({
      where: { email: dto.email, tenantId },
    });
    if (existingContact) {
      throw new ConflictException('Contact with this email already exists');
    }

    const contact = this.contactRepo.create({ ...dto, tenantId });
    return this.contactRepo.save(contact);
  }

  async findAllContacts(tenantId: string, query: ContactSearchDto): Promise<{ data: Contact[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, type, companyId } = query;

    const queryBuilder = this.contactRepo
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.company', 'company')
      .where('contact.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(contact.firstName LIKE :search OR contact.lastName LIKE :search OR contact.email LIKE :search OR contact.phone LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere('contact.type = :type', { type });
    }

    if (companyId) {
      queryBuilder.andWhere('contact.companyId = :companyId', { companyId });
    }

    queryBuilder
      .orderBy('contact.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findContactById(id: string, tenantId: string): Promise<Contact> {
    const contact = await this.contactRepo.findOne({
      where: { id, tenantId },
      relations: ['company'],
    });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async updateContact(id: string, tenantId: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findContactById(id, tenantId);
    Object.assign(contact, dto);
    return this.contactRepo.save(contact);
  }

  async deleteContact(id: string, tenantId: string): Promise<void> {
    const contact = await this.findContactById(id, tenantId);
    await this.contactRepo.remove(contact);
  }

  // ==================== LEAD METHODS ====================

  async createLead(tenantId: string, dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepo.create({ ...dto, tenantId });
    return this.leadRepo.save(lead);
  }

  async findAllLeads(tenantId: string, query: LeadSearchDto): Promise<{ data: Lead[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, status, source, assignedTo } = query;

    const queryBuilder = this.leadRepo
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.company', 'company')
      .leftJoinAndSelect('lead.contact', 'contact')
      .where('lead.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(lead.firstName LIKE :search OR lead.lastName LIKE :search OR lead.email LIKE :search OR lead.companyName LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('lead.status = :status', { status });
    }

    if (source) {
      queryBuilder.andWhere('lead.source = :source', { source });
    }

    if (assignedTo) {
      queryBuilder.andWhere('lead.assignedTo = :assignedTo', { assignedTo });
    }

    queryBuilder
      .orderBy('lead.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findLeadById(id: string, tenantId: string): Promise<Lead> {
    const lead = await this.leadRepo.findOne({
      where: { id, tenantId },
      relations: ['company', 'contact'],
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async updateLead(id: string, tenantId: string, dto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findLeadById(id, tenantId);
    
    if (dto.status === LeadStatus.WON) {
      await this.convertLeadToCustomer(lead);
    }

    Object.assign(lead, dto);
    return this.leadRepo.save(lead);
  }

  private async convertLeadToCustomer(lead: Lead): Promise<void> {
    if (lead.contactId) {
      await this.contactRepo.update(lead.contactId, { type: ContactType.CUSTOMER });
    }
  }

  async deleteLead(id: string, tenantId: string): Promise<void> {
    const lead = await this.findLeadById(id, tenantId);
    await this.leadRepo.remove(lead);
  }

  // ==================== DEAL METHODS ====================

  async createDeal(tenantId: string, dto: CreateDealDto): Promise<Deal> {
    let totalValue = dto.value;
    
    if (dto.products && dto.products.length > 0) {
      dto.products = dto.products.map((product, index) => {
        const amount = product.quantity * product.unitPrice * (1 - product.discount / 100);
        totalValue += amount;
        return { ...product, id: String(index + 1), amount };
      });
    }

    const deal = this.dealRepo.create({
      ...dto,
      tenantId,
      value: totalValue,
      currency: dto.currency || 'USD',
    });
    return this.dealRepo.save(deal);
  }

  async findAllDeals(tenantId: string, query: DealSearchDto): Promise<{ data: Deal[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, stage, assignedTo } = query;

    const queryBuilder = this.dealRepo
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.company', 'company')
      .leftJoinAndSelect('deal.contact', 'contact')
      .where('deal.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere('deal.title LIKE :search', { search: `%${search}%` });
    }

    if (stage) {
      queryBuilder.andWhere('deal.stage = :stage', { stage });
    }

    if (assignedTo) {
      queryBuilder.andWhere('deal.assignedTo = :assignedTo', { assignedTo });
    }

    queryBuilder
      .orderBy('deal.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async findDealById(id: string, tenantId: string): Promise<Deal> {
    const deal = await this.dealRepo.findOne({
      where: { id, tenantId },
      relations: ['company', 'contact', 'lead'],
    });
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async updateDeal(id: string, tenantId: string, dto: UpdateDealDto): Promise<Deal> {
    const deal = await this.findDealById(id, tenantId);
    Object.assign(deal, dto);
    return this.dealRepo.save(deal);
  }

  async deleteDeal(id: string, tenantId: string): Promise<void> {
    const deal = await this.findDealById(id, tenantId);
    await this.dealRepo.remove(deal);
  }

  // ==================== ACTIVITY METHODS ====================

  async createActivity(tenantId: string, dto: CreateActivityDto): Promise<Activity> {
    const activity = this.activityRepo.create({ ...dto, tenantId });
    return this.activityRepo.save(activity);
  }

  async findAllActivities(tenantId: string, query: any): Promise<{ data: Activity[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, contactId, leadId, dealId, assignedTo } = query;

    const queryBuilder = this.activityRepo
      .createQueryBuilder('activity')
      .where('activity.tenantId = :tenantId', { tenantId });

    if (contactId) {
      queryBuilder.andWhere('activity.contactId = :contactId', { contactId });
    }

    if (leadId) {
      queryBuilder.andWhere('activity.leadId = :leadId', { leadId });
    }

    if (dealId) {
      queryBuilder.andWhere('activity.dealId = :dealId', { dealId });
    }

    if (assignedTo) {
      queryBuilder.andWhere('activity.assignedTo = :assignedTo', { assignedTo });
    }

    queryBuilder
      .orderBy('activity.dueDate', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async updateActivity(id: string, tenantId: string, dto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.activityRepo.findOne({ where: { id, tenantId } });
    if (!activity) throw new NotFoundException('Activity not found');

    if (dto.isCompleted && !activity.isCompleted) {
      activity.completedAt = new Date();
    }

    Object.assign(activity, dto);
    return this.activityRepo.save(activity);
  }

  // ==================== DASHBOARD & REPORTS ====================

  async getDashboardStats(tenantId: string): Promise<any> {
    const totalLeads = await this.leadRepo.count({ where: { tenantId } });
    const newLeads = await this.leadRepo.count({ where: { tenantId, status: LeadStatus.NEW } });
    const qualifiedLeads = await this.leadRepo.count({ where: { tenantId, status: LeadStatus.QUALIFIED } });
    
    const totalDeals = await this.dealRepo.count({ where: { tenantId } });
    const activeDeals = await this.dealRepo.count({ where: { tenantId } });
    const wonDeals = await this.dealRepo.count({ where: { tenantId, stage: DealStage.CLOSED_WON } });
    
    const totalDealValue = await this.dealRepo
      .createQueryBuilder('deal')
      .where('deal.tenantId = :tenantId', { tenantId })
      .andWhere('deal.stage != :lost', { lost: DealStage.CLOSED_LOST })
      .select('SUM(deal.value)', 'total')
      .getRawOne();

    const wonDealValue = await this.dealRepo
      .createQueryBuilder('deal')
      .where('deal.tenantId = :tenantId', { tenantId })
      .andWhere('deal.stage = :won', { won: DealStage.CLOSED_WON })
      .select('SUM(deal.value)', 'total')
      .getRawOne();

    const totalContacts = await this.contactRepo.count({ where: { tenantId } });
    const customers = await this.contactRepo.count({ where: { tenantId, type: ContactType.CUSTOMER } });

    const totalCompanies = await this.companyRepo.count({ where: { tenantId } });

    const upcomingActivities = await this.activityRepo.count({
      where: { 
        tenantId,
        isCompleted: false,
      },
    });

    return {
      leads: {
        total: totalLeads,
        new: newLeads,
        qualified: qualifiedLeads,
      },
      deals: {
        total: totalDeals,
        active: activeDeals,
        won: wonDeals,
        totalValue: totalDealValue?.total || 0,
        wonValue: wonDealValue?.total || 0,
      },
      contacts: {
        total: totalContacts,
        customers: customers,
      },
      companies: {
        total: totalCompanies,
      },
      activities: {
        upcoming: upcomingActivities,
      },
    };
  }
}
