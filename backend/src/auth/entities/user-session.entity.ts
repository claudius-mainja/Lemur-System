import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('user_sessions')
export class UserSession {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @Field()
  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Field({ nullable: true })
  @Column({ name: 'refresh_token_hash', nullable: true })
  refreshTokenHash?: string;

  @Field({ nullable: true })
  @Column({ name: 'ip_address', nullable: true, type: 'inet' })
  ipAddress?: string;

  @Field({ nullable: true })
  @Column({ name: 'user_agent', nullable: true, type: 'text' })
  userAgent?: string;

  @Field({ nullable: true })
  @Column({ name: 'device_type', nullable: true, length: 20 })
  deviceType?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 50 })
  browser?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 50 })
  os?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  location?: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Field({ nullable: true })
  @Column({ name: 'revoked_at', nullable: true, type: 'timestamptz' })
  revokedAt?: Date;
}
