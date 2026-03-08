import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { CrmService } from '../services/crm.service';
import { 
  CreateCompanyDto, UpdateCompanyDto,
  CreateContactDto, UpdateContactDto,
  CreateLeadDto, UpdateLeadDto,
  CreateDealDto, UpdateDealDto,
  CreateActivityDto, UpdateActivityDto,
  LeadSearchDto, DealSearchDto, ContactSearchDto
} from '../dto/crm.dto';

@Controller('api/v1/crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || 'default-tenant';
  }

  // ==================== COMPANY ENDPOINTS ====================

  @Post('companies')
  @HttpCode(HttpStatus.CREATED)
  async createCompany(@Body() dto: CreateCompanyDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.createCompany(tenantId, dto) };
  }

  @Get('companies')
  async findAllCompanies(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.findAllCompanies(tenantId) };
  }

  @Get('companies/:id')
  async findCompany(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.findCompanyById(id, tenantId) };
  }

  @Put('companies/:id')
  async updateCompany(@Param('id') id: string, @Body() dto: UpdateCompanyDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.updateCompany(id, tenantId, dto) };
  }

  @Delete('companies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompany(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.crmService.deleteCompany(id, tenantId);
    return { success: true };
  }

  // ==================== CONTACT ENDPOINTS ====================

  @Post('contacts')
  @HttpCode(HttpStatus.CREATED)
  async createContact(@Body() dto: CreateContactDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.createContact(tenantId, dto) };
  }

  @Get('contacts')
  async findAllContacts(@Query() query: ContactSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.crmService.findAllContacts(tenantId, query);
  }

  @Get('contacts/:id')
  async findContact(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.findContactById(id, tenantId) };
  }

  @Put('contacts/:id')
  async updateContact(@Param('id') id: string, @Body() dto: UpdateContactDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.updateContact(id, tenantId, dto) };
  }

  @Delete('contacts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContact(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.crmService.deleteContact(id, tenantId);
    return { success: true };
  }

  // ==================== LEAD ENDPOINTS ====================

  @Post('leads')
  @HttpCode(HttpStatus.CREATED)
  async createLead(@Body() dto: CreateLeadDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.createLead(tenantId, dto) };
  }

  @Get('leads')
  async findAllLeads(@Query() query: LeadSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.crmService.findAllLeads(tenantId, query);
  }

  @Get('leads/:id')
  async findLead(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.findLeadById(id, tenantId) };
  }

  @Put('leads/:id')
  async updateLead(@Param('id') id: string, @Body() dto: UpdateLeadDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.updateLead(id, tenantId, dto) };
  }

  @Delete('leads/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLead(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.crmService.deleteLead(id, tenantId);
    return { success: true };
  }

  // ==================== DEAL ENDPOINTS ====================

  @Post('deals')
  @HttpCode(HttpStatus.CREATED)
  async createDeal(@Body() dto: CreateDealDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.createDeal(tenantId, dto) };
  }

  @Get('deals')
  async findAllDeals(@Query() query: DealSearchDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.crmService.findAllDeals(tenantId, query);
  }

  @Get('deals/:id')
  async findDeal(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.findDealById(id, tenantId) };
  }

  @Put('deals/:id')
  async updateDeal(@Param('id') id: string, @Body() dto: UpdateDealDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.updateDeal(id, tenantId, dto) };
  }

  @Delete('deals/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeal(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    await this.crmService.deleteDeal(id, tenantId);
    return { success: true };
  }

  // ==================== ACTIVITY ENDPOINTS ====================

  @Post('activities')
  @HttpCode(HttpStatus.CREATED)
  async createActivity(@Body() dto: CreateActivityDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.createActivity(tenantId, dto) };
  }

  @Get('activities')
  async findAllActivities(@Query() query: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return await this.crmService.findAllActivities(tenantId, query);
  }

  @Put('activities/:id')
  async updateActivity(@Param('id') id: string, @Body() dto: UpdateActivityDto, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.updateActivity(id, tenantId, dto) };
  }

  // ==================== DASHBOARD ====================

  @Get('dashboard/stats')
  async getDashboardStats(@Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return { data: await this.crmService.getDashboardStats(tenantId) };
  }
}
