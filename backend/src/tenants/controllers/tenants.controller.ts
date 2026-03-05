import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './services/tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new organization/tenant' })
  async register(@Body() data: {
    name: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    timezone?: string;
    currency?: string;
    language?: string;
  }) {
    return this.tenantsService.register(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tenants' })
  async findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by ID' })
  async findById(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.tenantsService.update(id, data);
  }

  @Get(':id/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant settings' })
  async getSettings(@Param('id') id: string) {
    return this.tenantsService.getSettings(id);
  }

  @Get(':id/modules')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant modules' })
  async getModules(@Param('id') id: string) {
    return this.tenantsService.getModules(id);
  }
}
