-- ============================================================================
-- CRM Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    company_id UUID,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    mobile VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    timezone VARCHAR(100),
    avatar_url VARCHAR(500),
    birthday DATE,
    source VARCHAR(100),
    type VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    social_profiles JSONB,
    custom_fields JSONB,
    notes TEXT,
    owner_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS crm_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    fax VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    annual_revenue DECIMAL(15,2),
    tax_id VARCHAR(50),
    logo_url VARCHAR(500),
    type VARCHAR(20) DEFAULT 'prospect',
    is_active BOOLEAN DEFAULT true,
    owner_id UUID,
    social_profiles JSONB,
    custom_fields JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    company_id UUID,
    contact_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company_name VARCHAR(255),
    title VARCHAR(100),
    industry VARCHAR(100),
    status VARCHAR(20) DEFAULT 'new',
    source VARCHAR(50),
    probability INTEGER,
    expected_revenue DECIMAL(15,2),
    expected_close_date DATE,
    next_activity_date DATE,
    converted_at TIMESTAMPTZ,
    converted_contact_id UUID,
    converted_company_id UUID,
    converted_opportunity_id UUID,
    owner_id UUID,
    custom_fields JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    lead_id UUID,
    company_id UUID,
    contact_id UUID,
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(20) DEFAULT 'prospecting',
    status VARCHAR(20) DEFAULT 'open',
    probability INTEGER,
    expected_revenue DECIMAL(15,2) DEFAULT 0,
    weighted_revenue DECIMAL(15,2) DEFAULT 0,
    expected_close_date DATE,
    actual_close_date DATE,
    lost_reason VARCHAR(255),
    won_notes TEXT,
    next_activity_date DATE,
    owner_id UUID,
    partner_id UUID,
    custom_fields JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    related_to_type VARCHAR(50),
    related_to_id UUID,
    company_id UUID,
    contact_id UUID,
    lead_id UUID,
    opportunity_id UUID,
    due_date DATE NOT NULL,
    due_time VARCHAR(10),
    duration_minutes INTEGER,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'planned',
    completed_at TIMESTAMPTZ,
    result_notes TEXT,
    reminder_at TIMESTAMPTZ,
    owner_id UUID,
    assigned_to_id UUID,
    attendees JSONB,
    attachments JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Billing Tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    interval VARCHAR(20) NOT NULL,
    interval_count INTEGER DEFAULT 1,
    max_users INTEGER DEFAULT 5,
    max_storage_gb INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    features JSONB,
    modules JSONB,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    stripe_subscription_id VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    is_trial BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) NOT NULL,
    stripe_invoice_id VARCHAR(100),
    paid_at TIMESTAMPTZ,
    due_date DATE,
    paid_by UUID,
    stripe_payment_intent_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    stripe_payment_method_id VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    brand VARCHAR(10) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    exp_month INTEGER NOT NULL,
    exp_year INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Insert Default Plans
-- ============================================================================

INSERT INTO plans (id, name, code, description, price, interval, interval_count, max_users, max_storage_gb, is_featured, features, modules, sort_order) VALUES 
('plan-free', 'Starter', 'starter', 'Perfect for small teams getting started', 0, 'month', 1, 5, 5, false, 
 '{"users": 5, "storage": "5GB", "support": "Email", "modules": ["hr", "finance"]}', 
 '["hr", "finance"]', 1),
('plan-basic', 'Basic', 'basic', 'Essential features for growing businesses', 29, 'month', 1, 25, 25, false,
 '{"users": 25, "storage": "25GB", "support": "Email & Chat", "modules": ["hr", "payroll", "finance", "productivity"]}',
 '["hr", "payroll", "finance", "productivity"]', 2),
('plan-professional', 'Professional', 'professional', 'Complete solution for medium businesses', 79, 'month', 1, 100, 100, true,
 '{"users": 100, "storage": "100GB", "support": "Priority 24/7", "modules": ["hr", "payroll", "finance", "productivity", "supply_chain", "crm"]}',
 '["hr", "payroll", "finance", "productivity", "supply_chain", "crm"]', 3),
('plan-enterprise', 'Enterprise', 'enterprise', 'Unlimited for large organizations', 199, 'month', 1, 999999, 999999, false,
 '{"users": "Unlimited", "storage": "Unlimited", "support": "Dedicated 24/7", "modules": ["all"]}',
 '["hr", "payroll", "finance", "productivity", "supply_chain", "crm", "services"]', 4)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- CRM Indexes
-- ============================================================================

CREATE INDEX idx_crm_contacts_org ON crm_contacts(organization_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_company ON crm_contacts(company_id);
CREATE INDEX idx_crm_companies_org ON crm_companies(organization_id);
CREATE INDEX idx_crm_leads_org ON crm_leads(organization_id);
CREATE INDEX idx_crm_leads_status ON crm_leads(status);
CREATE INDEX idx_crm_opportunities_org ON crm_opportunities(organization_id);
CREATE INDEX idx_crm_opportunities_stage ON crm_opportunities(stage);
CREATE INDEX idx_crm_activities_org ON crm_activities(organization_id);
CREATE INDEX idx_crm_activities_due ON crm_activities(due_date);
