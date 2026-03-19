import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

export enum SubscriptionPlan {
  STARTER = "starter",
  PROFESSIONAL = "professional",
  ENTERPRISE = "enterprise",
}

export const PLAN_FEATURES = {
  [SubscriptionPlan.STARTER]: {
    name: "Starter",
    price: 10.6,
    maxUsers: 6,
    modules: ["hr", "finance", "supply-chain"],
    storageGB: 10,
    features: ["email_support", "basic_reporting", "mobile_app"],
    apiAccess: false,
    customIntegrations: false,
    sso: false,
    prioritySupport: false,
    advancedAnalytics: false,
    dedicatedAccountManager: false,
    onPremise: false,
    slaGuarantee: false,
    customTraining: false,
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    name: "Professional",
    price: 20.5,
    maxUsers: 50,
    modules: [
      "hr",
      "finance",
      "crm",
      "payroll",
      "productivity",
      "supply-chain",
    ],
    storageGB: 100,
    features: [
      "email_support",
      "priority_support",
      "basic_reporting",
      "advanced_analytics",
      "mobile_app",
      "api_access",
      "custom_integrations",
      "sso",
    ],
    apiAccess: true,
    customIntegrations: true,
    sso: true,
    prioritySupport: true,
    advancedAnalytics: true,
    dedicatedAccountManager: false,
    onPremise: false,
    slaGuarantee: false,
    customTraining: false,
  },
  [SubscriptionPlan.ENTERPRISE]: {
    name: "Enterprise",
    price: null,
    maxUsers: null,
    modules: [
      "hr",
      "finance",
      "crm",
      "payroll",
      "productivity",
      "supply-chain",
      "email",
      "documents",
    ],
    storageGB: null,
    features: [
      "email_support",
      "priority_support",
      "dedicated_support_24_7",
      "basic_reporting",
      "advanced_analytics",
      "custom_reporting",
      "mobile_app",
      "api_access",
      "custom_integrations",
      "sso",
      "advanced_security",
      "dedicated_account_manager",
      "on_premise",
      "sla_guarantee",
      "custom_training",
    ],
    apiAccess: true,
    customIntegrations: true,
    sso: true,
    prioritySupport: true,
    advancedAnalytics: true,
    dedicatedAccountManager: true,
    onPremise: true,
    slaGuarantee: true,
    customTraining: true,
  },
};

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ default: "active" })
  status: string;

  @Column({ default: "UTC" })
  timezone: string;

  @Column({ default: "USD" })
  currency: string;

  @Column({ default: "en" })
  language: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: SubscriptionPlan,
    default: SubscriptionPlan.STARTER,
  })
  plan: SubscriptionPlan;

  @Column({ type: "simple-array", nullable: true })
  modules: string[];

  @Column({ default: false })
  isOnTrial: boolean;

  @Column({ nullable: true })
  trialEndsAt: Date;

  @Column({ nullable: true })
  subscriptionStartDate: Date;

  @Column({ nullable: true })
  subscriptionEndDate: Date;

  @Column({ default: 0 })
  currentUsers: number;

  @Column({ default: 10 })
  storageUsedGB: number;

  @Column({ nullable: true })
  billingEmail: string;

  @Column({ nullable: true })
  vatNumber: string;
}
