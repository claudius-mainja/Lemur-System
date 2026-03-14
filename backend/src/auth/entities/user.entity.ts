import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

@ObjectType()
@Entity('users')
@Index(['email'])
@Index(['organizationId', 'email'], { unique: true })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Field()
  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Field()
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Field()
  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Field({ nullable: true })
  @Column({ name: 'avatar_url', nullable: true, length: 500 })
  avatarUrl?: string;

  @Field()
  @Column({ default: 'employee', length: 50 })
  role: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Field({ nullable: true })
  @Column({ name: 'verified_at', nullable: true, type: 'timestamptz' })
  verifiedAt?: Date;

  @Field({ nullable: true })
  @Column({ name: 'last_login_at', nullable: true, type: 'timestamptz' })
  lastLoginAt?: Date;

  @Field()
  @Column({ name: 'login_count', default: 0 })
  loginCount: number;

  @Field()
  @Column({ name: 'failed_login_attempts', default: 0 })
  failedLoginAttempts: number;

  @Field({ nullable: true })
  @Column({ name: 'locked_until', nullable: true, type: 'timestamptz' })
  lockedUntil?: Date;

  @Field()
  @Column({ name: 'must_change_password', default: false })
  mustChangePassword: boolean;

  @Field({ nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
