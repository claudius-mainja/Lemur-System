import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('mfa_configurations')
export class MfaConfiguration {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Field()
  @Column({ length: 20 })
  type: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  secret?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Field()
  @Column({ name: 'is_enabled', default: false })
  isEnabled: boolean;

  @Field()
  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @Field({ nullable: true })
  @Column({ name: 'backup_codes', type: 'text', array: true, nullable: true })
  backupCodes?: string[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ name: 'verified_at', nullable: true, type: 'timestamptz' })
  verifiedAt?: Date;
}

@ObjectType()
@Entity('login_attempts')
export class LoginAttempt {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ name: 'organization_id', nullable: true, type: 'uuid' })
  organizationId?: string;

  @Field({ nullable: true })
  @Column({ name: 'user_id', nullable: true, type: 'uuid' })
  userId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ name: 'ip_address', nullable: true, type: 'inet' })
  ipAddress?: string;

  @Field({ nullable: true })
  @Column({ name: 'user_agent', nullable: true, type: 'text' })
  userAgent?: string;

  @Field()
  @Column({ default: false })
  success: boolean;

  @Field({ nullable: true })
  @Column({ name: 'failure_reason', nullable: true })
  failureReason?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

@ObjectType()
@Entity('password_resets')
export class PasswordReset {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Field()
  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Field()
  @Column({ default: false })
  used: boolean;

  @Field()
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
