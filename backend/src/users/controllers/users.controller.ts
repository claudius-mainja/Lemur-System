import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private getTenantId(headers: any): string {
    return headers['x-tenant-id'] || headers['x-tenant-id'];
  }

  @Get()
  @ApiOperation({ summary: 'Get all users in tenant' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 50, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return this.usersService.findAll(tenantId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findById(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return this.usersService.findById(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() data: {
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    department?: string;
  }, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return this.usersService.create(tenantId, data);
  }

  @Post('invite')
  @ApiOperation({ summary: 'Invite a new user to the organization' })
  async invite(@Body() data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return this.usersService.invite(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() data: any, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return this.usersService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async delete(@Param('id') id: string, @Headers() headers: any) {
    const tenantId = this.getTenantId(headers);
    return this.usersService.delete(tenantId, id);
  }
}
