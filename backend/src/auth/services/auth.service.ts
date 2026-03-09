import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserSession } from '../entities/user-session.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { LoginDto, RegisterDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '../dto/auth.dto';

const PLAN_MODULES: Record<string, string[]> = {
  starter: ['hr', 'finance', 'payroll'],
  professional: ['hr', 'finance', 'payroll', 'crm', 'supply-chain'],
  enterprise: ['hr', 'finance', 'payroll', 'crm', 'supply-chain', 'email', 'documents', 'settings'],
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, organizationId: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email, organizationId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = this.userRepository.create({
      email: registerDto.email,
      organizationId,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: 'employee',
      isActive: true,
    });

    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto, ipAddress?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);
    await this.createSession(user.id, tokens.accessToken, ipAddress);

    const tenant = await this.tenantRepository.findOne({ where: { id: user.organizationId } });
    const plan = tenant?.plan || 'starter';
    const modules = tenant?.modules || PLAN_MODULES[plan] || PLAN_MODULES['starter'];

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
        organizationName: tenant?.name || 'Organization',
        subscription: plan,
        modules,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(sessionId: string) {
    await this.sessionRepository.update(sessionId, { isActive: false });
    return { message: 'Logged out successfully' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 12);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: forgotPasswordDto.email } });
    if (!user) {
      return { message: 'If email exists, reset instructions sent' };
    }
    return { message: 'If email exists, reset instructions sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return { message: 'Password reset successfully' };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, token: string, ipAddress?: string) {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    const session = this.sessionRepository.create({
      userId,
      tokenHash: this.hashToken(token),
      ipAddress,
      expiresAt,
    });

    await this.sessionRepository.save(session);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
