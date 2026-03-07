import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('employees')
export class Employee {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Field()
  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Field()
  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 20 })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  position?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  manager?: string;

  @Field()
  @Column({ default: 'active' })
  status: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'hire_date', type: 'date' })
  hireDate?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'salary' })
  salary?: number;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'resume_url' })
  resumeUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  idNumber?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'emergency_contact' })
  emergencyContact?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'emergency_phone' })
  emergencyPhone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text', name: 'bio' })
  bio?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'avatar_url' })
  avatarUrl?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
