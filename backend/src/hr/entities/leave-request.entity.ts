import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('leave_requests')
export class LeaveRequest {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'employee_id' })
  employeeId: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'employee_name' })
  employeeName?: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Field()
  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Field()
  @Column()
  days: number;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  reason?: string;

  @Field()
  @Column({ default: 'pending' })
  status: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'approved_by' })
  approvedBy?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'date', name: 'approved_at' })
  approvedAt?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text', name: 'rejection_reason' })
  rejectionReason?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
