import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(tenantId: string, page = 1, limit = 50): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      where: { organizationId: tenantId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findById(tenantId: string, id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, organizationId: tenantId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(tenantId: string, data: {
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    department?: string;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email, organizationId: tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'employee',
      organizationId: tenantId,
      passwordHash: await bcrypt.hash('TempPassword123!', 10),
    });

    return this.userRepository.save(user);
  }

  async invite(tenantId: string, data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<{ message: string; user: User }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email, organizationId: tenantId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    
    const user = this.userRepository.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      organizationId: tenantId,
      passwordHash: await bcrypt.hash(tempPassword, 10),
      isActive: true,
    });

    await this.userRepository.save(user);

    return {
      message: `User invited successfully. Temporary password: ${tempPassword}`,
      user,
    };
  }

  async update(tenantId: string, id: string, data: Partial<User>): Promise<User> {
    await this.findById(tenantId, id);
    await this.userRepository.update(id, data);
    return this.findById(tenantId, id);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.findById(tenantId, id);
    await this.userRepository.delete(id);
  }
}
