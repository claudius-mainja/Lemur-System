-- ============================================================================
-- LemurSystem Enterprise - Database Schema
-- PostgreSQL 15+
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "hstore";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- ============================================================================
-- SCHEMAS
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS tenants;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS payroll;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS productivity;
CREATE SCHEMA IF NOT EXISTS supply_chain;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS public;

-- ============================================================================
-- TENANTS (Multi-tenancy for SaaS)
-- ============================================================================

CREATE TABLE tenants.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255),
    logo_url VARCHAR(500),
    settings JSONB DEFAULT '{}',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(20) DEFAULT 'active',
    subscription_expires_at TIMESTAMPTZ,
    max_users INTEGER DEFAULT 5,
    max_storage_gb INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.organization_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(20) DEFAULT 'HH:mm',
    currency VARCHAR(3) DEFAULT 'USD',
    language VARCHAR(10) DEFAULT 'en',
    fiscal_year_start_month INTEGER DEFAULT 1,
    enable_two_factor BOOLEAN DEFAULT false,
    password_policy JSONB DEFAULT '{"minLength": 8, "requireUppercase": true, "requireNumbers": true}',
    email_notifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tenants.organization_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, module_name)
);

-- ============================================================================
-- AUTHENTICATION
-- ============================================================================

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    email CITEXT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    must_change_password BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(organization_id, email)
);

CREATE TABLE auth.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(20),
    browser VARCHAR(50),
    os VARCHAR(50),
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE TABLE auth.mfa_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'totp', 'sms', 'email'
    secret VARCHAR(255),
    phone VARCHAR(20),
    is_enabled BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    backup_codes TEXT[], -- Encrypted backup codes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    UNIQUE(user_id, type)
);

CREATE TABLE auth.login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    failure_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth.password_resets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    used BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RBAC (Role-Based Access Control)
-- ============================================================================

CREATE TABLE auth.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 0,
    parent_role_id UUID REFERENCES auth.roles(id),
    is_system BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE auth.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, role_id)
);

-- ============================================================================
-- AUDIT LOGGING
-- ============================================================================

CREATE TABLE audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES tenants.organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    session_id UUID,
    request_id UUID,
    action VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'SUCCESS', -- SUCCESS, FAILED
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_org ON audit.logs(organization_id);
CREATE INDEX idx_audit_user ON audit.logs(user_id);
CREATE INDEX idx_audit_resource ON audit.logs(resource_type, resource_id);
CREATE INDEX idx_audit_timestamp ON audit.logs(created_at);
CREATE INDEX idx_audit_action ON audit.logs(action);

-- ============================================================================
-- HUMAN RESOURCES
-- ============================================================================

CREATE TABLE hr.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    parent_department_id UUID REFERENCES hr.departments(id),
    manager_id UUID, -- References hr.employees.id
    budget DECIMAL(15,2),
    cost_center VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE hr.job_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    department_id UUID REFERENCES hr.departments(id),
    pay_grade VARCHAR(20),
    min_salary DECIMAL(15,2),
    max_salary DECIMAL(15,2),
    requirements JSONB DEFAULT '[]',
    responsibilities JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hr.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    employee_number VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    gender VARCHAR(20),
    date_of_birth DATE,
    marital_status VARCHAR(20),
    nationality VARCHAR(100),
    photo_url VARCHAR(500),
    
    -- Employment Info
    department_id UUID REFERENCES hr.departments(id),
    job_position_id UUID REFERENCES hr.job_positions(id),
    manager_id UUID REFERENCES hr.employees(id),
    employment_type VARCHAR(20) DEFAULT 'full-time', -- full-time, part-time, contract
    status VARCHAR(20) DEFAULT 'active', -- active, on-leave, terminated
    hire_date DATE NOT NULL,
    termination_date DATE,
    termination_reason VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    
    -- PII (Encrypted)
    personal_info_encrypted TEXT,
    ssn_encrypted VARCHAR(255),
    bank_details_encrypted TEXT,
    
    -- Additional
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(organization_id, employee_number),
    UNIQUE(organization_id, email)
);

CREATE TABLE hr.employee_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- id_card, resume, certificate, contract
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    expiry_date DATE,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Management
CREATE TABLE hr.leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    accrual_frequency VARCHAR(20) DEFAULT 'monthly', -- yearly, monthly, bi-weekly
    accrual_days_per_year DECIMAL(5,2) DEFAULT 0,
    max_balance DECIMAL(5,2),
    min_balance DECIMAL(5,2) DEFAULT 0,
    requires_approval BOOLEAN DEFAULT true,
    approver_role VARCHAR(50),
    is_paid BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    color VARCHAR(7), -- Hex color
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE hr.leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES hr.leave_types(id),
    year INTEGER NOT NULL,
    total_days DECIMAL(5,2) DEFAULT 0,
    used_days DECIMAL(5,2) DEFAULT 0,
    pending_days DECIMAL(5,2) DEFAULT 0,
    carry_over_days DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, employee_id, leave_type_id, year)
);

CREATE TABLE hr.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES hr.leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    approver_id UUID REFERENCES hr.employees(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    is_half_day BOOLEAN DEFAULT false,
    half_day_period VARCHAR(10), -- morning, afternoon
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PAYROLL
-- ============================================================================

CREATE TABLE payroll.salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE payroll.salary_structure_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    structure_id UUID NOT NULL REFERENCES payroll.salary_structures(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- earnings, deduction
    category VARCHAR(50), -- basic, allowance, bonus, tax, benefit
    amount_type VARCHAR(20) NOT NULL, -- fixed, percentage
    amount DECIMAL(12,2) DEFAULT 0,
    percentage DECIMAL(5,2),
    depends_on VARCHAR(100), -- Formula dependency
    condition VARCHAR(500), -- Conditional logic
    is_active BOOLEAN DEFAULT true,
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll.employee_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES hr.employees(id) ON DELETE CASCADE,
    structure_id UUID REFERENCES payroll.salary_structures(id),
    contract_type VARCHAR(50) DEFAULT 'permanent',
    start_date DATE NOT NULL,
    end_date DATE,
    base_salary DECIMAL(12,2) NOT NULL,
    working_hours_per_week INTEGER DEFAULT 40,
    pay_frequency VARCHAR(20) DEFAULT 'monthly', -- weekly, bi-weekly, monthly
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_routing_number VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, employee_id, is_active)
);

CREATE TABLE payroll.tax_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    country VARCHAR(3) NOT NULL,
    state VARCHAR(100),
    tax_type VARCHAR(50) NOT NULL, -- income_tax, social_security, medicare
    name VARCHAR(255) NOT NULL,
    rate DECIMAL(5,4),
    brackets JSONB DEFAULT '[]', -- [{min: 0, max: 10000, rate: 0.1}]
    cap DECIMAL(12,2),
    is_employer_contribution BOOLEAN DEFAULT false,
    effective_from DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll.payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    run_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, computed, approved, paid
    processed_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    payment_date DATE,
    total_gross DECIMAL(15,2) DEFAULT 0,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    total_net DECIMAL(15,2) DEFAULT 0,
    total_tax DECIMAL(15,2) DEFAULT 0,
    total_employees INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll.payroll_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID NOT NULL REFERENCES payroll.payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES hr.employees(id),
    employee_number VARCHAR(50),
    employee_name VARCHAR(200),
    department_name VARCHAR(100),
    
    -- Earnings
    basic_salary DECIMAL(12,2) DEFAULT 0,
    overtime DECIMAL(12,2) DEFAULT 0,
    allowances JSONB DEFAULT '{}', -- {housing: 500, transport: 200}
    bonuses JSONB DEFAULT '{}',
    other_earnings JSONB DEFAULT '{}',
    
    -- Deductions
    tax_deduction DECIMAL(12,2) DEFAULT 0,
    social_security DECIMAL(12,2) DEFAULT 0,
    health_insurance DECIMAL(12,2) DEFAULT 0,
    other_deductions JSONB DEFAULT '{}',
    
    -- Totals
    gross_salary DECIMAL(12,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'pending', -- pending, processed, paid
    payment_method VARCHAR(20) DEFAULT 'bank_transfer',
    payment_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll.payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES hr.employees(id),
    run_id UUID REFERENCES payroll.payroll_runs(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    issue_date DATE NOT NULL,
    
    earnings JSONB NOT NULL,
    deductions JSONB NOT NULL,
    employer_contributions JSONB DEFAULT '{}',
    
    gross_salary DECIMAL(12,2) NOT NULL,
    total_deductions DECIMAL(12,2) NOT NULL,
    net_salary DECIMAL(12,2) NOT NULL,
    tax_withheld DECIMAL(12,2) DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'issued',
    pdf_url VARCHAR(500),
    is_received BOOLEAN DEFAULT false,
    received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FINANCE
-- ============================================================================

CREATE TABLE finance.account_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    nature VARCHAR(20) NOT NULL, -- asset, liability, equity, revenue, expense
    report_type VARCHAR(50),
    allow_reconciliation BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE finance.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type_id UUID REFERENCES finance.account_types(id),
    parent_account_id UUID REFERENCES finance.accounts(id),
    description TEXT,
    tax_code VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    allow_reconciliation BOOLEAN DEFAULT false,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    bank_reconciliation BOOLEAN DEFAULT false,
    is_cash_account BOOLEAN DEFAULT false,
    is_cheque BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE finance.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(20) DEFAULT 'customer', -- customer, vendor, employee
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(12,2),
    price_list VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE finance.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    entry_number VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    reference VARCHAR(100),
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, posted, cancelled
    journal_id UUID, -- References finance.journals
    source_document_type VARCHAR(50),
    source_document_id UUID,
    total_debit DECIMAL(15,2) DEFAULT 0,
    total_credit DECIMAL(15,2) DEFAULT 0,
    posted_by UUID REFERENCES auth.users(id),
    posted_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, entry_number)
);

CREATE TABLE finance.journal_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES finance.journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES finance.accounts(id),
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    partner_id UUID REFERENCES finance.partners(id),
    analytic_account_id UUID,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    description VARCHAR(500),
    reference VARCHAR(100),
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finance.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- customer_invoice, vendor_bill
    partner_id UUID NOT NULL REFERENCES finance.partners(id),
    date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,4) DEFAULT 1,
    
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    amount_paid DECIMAL(15,2) DEFAULT 0,
    amount_due DECIMAL(15,2) DEFAULT 0,
    
    payment_terms VARCHAR(100),
    notes TEXT,
    terms TEXT,
    attachment_urls JSONB DEFAULT '[]',
    
    related_invoice_id UUID, -- For credit notes
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, type, invoice_number)
);

CREATE TABLE finance.invoice_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES finance.invoices(id) ON DELETE CASCADE,
    product_id UUID,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(12,4) DEFAULT 1,
    uom VARCHAR(20),
    unit_price DECIMAL(12,4) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_ids UUID[],
    tax_amount DECIMAL(15,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finance.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    payment_number VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL, -- incoming, outgoing
    partner_id UUID REFERENCES finance.partners(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10,4) DEFAULT 1,
    payment_method VARCHAR(50), -- cash, bank_transfer, check, credit_card
    reference VARCHAR(100),
    memo TEXT,
    status VARCHAR(20) DEFAULT 'posted',
    journal_id UUID,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, payment_number)
);

CREATE TABLE finance.payment_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES finance.payments(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES finance.invoices(id),
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE finance.fixed_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    purchase_date DATE NOT NULL,
    purchase_value DECIMAL(15,2) NOT NULL,
    salvage_value DECIMAL(15,2) DEFAULT 0,
    useful_life_years INTEGER,
    depreciation_method VARCHAR(20) DEFAULT 'straight_line', -- straight_line, declining_balance
    depreciation_rate DECIMAL(5,4),
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
    book_value DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'active', -- active, disposed, fully_depreciated
    location VARCHAR(255),
    serial_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE finance.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    department_id UUID REFERENCES hr.departments(id),
    status VARCHAR(20) DEFAULT 'draft',
    total_budget DECIMAL(15,2) NOT NULL,
    allocated_amount DECIMAL(15,2) DEFAULT 0,
    used_amount DECIMAL(15,2) DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRODUCTIVITY
-- ============================================================================

CREATE TABLE productivity.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'planning', -- planning, active, on_hold, completed, cancelled
    priority VARCHAR(20) DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    deadline DATE,
    budget DECIMAL(15,2),
    progress INTEGER DEFAULT 0,
    owner_id UUID REFERENCES auth.users(id),
    customer_id UUID REFERENCES finance.partners(id),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES productivity.projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'todo', -- todo, in_progress, review, done, cancelled
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    type VARCHAR(20) DEFAULT 'task', -- task, bug, feature, subtask
    assignee_id UUID REFERENCES auth.users(id),
    reporter_id UUID REFERENCES auth.users(id),
    parent_task_id UUID REFERENCES productivity.tasks(id),
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    estimated_hours DECIMAL(8,2),
    actual_hours DECIMAL(8,2) DEFAULT 0,
    progress INTEGER DEFAULT 0,
    tags TEXT[],
    dependencies JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES productivity.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    folder_id UUID, -- References productivity.folders
    owner_id UUID REFERENCES auth.users(id),
    shared_with JSONB DEFAULT '[]',
    permissions JSONB DEFAULT '{"read": true, "write": true}',
    current_version INTEGER DEFAULT 1,
    total_versions INTEGER DEFAULT 1,
    is_starred BOOLEAN DEFAULT false,
    is_shared BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES productivity.documents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    change_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_folder_id UUID REFERENCES productivity.folders(id),
    owner_id UUID REFERENCES auth.users(id),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    timezone VARCHAR(50) DEFAULT 'UTC',
    recurrence_rule VARCHAR(500),
    location VARCHAR(255),
    organizer_id UUID REFERENCES auth.users(id),
    attendees JSONB DEFAULT '[]',
    reminders JSONB DEFAULT '[{"minutes": 15, "method": "notification"}]',
    related_to_type VARCHAR(50),
    related_to_id UUID,
    is_private BOOLEAN DEFAULT false,
    color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) DEFAULT 'public', -- public, private, direct
    description TEXT,
    members JSONB DEFAULT '[]',
    owner_id UUID REFERENCES auth.users(id),
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id UUID NOT NULL REFERENCES productivity.channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, file, system
    attachments JSONB DEFAULT '[]',
    reply_to_id UUID REFERENCES productivity.messages(id),
    reactions JSONB DEFAULT '{}',
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE productivity.wiki_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    space VARCHAR(50) DEFAULT 'default',
    parent_page_id UUID REFERENCES productivity.wiki_pages(id),
    author_id UUID REFERENCES auth.users(id),
    last_editor_id UUID REFERENCES auth.users(id),
    version INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT true,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SUPPLY CHAIN
-- ============================================================================

CREATE TABLE supply_chain.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    parent_category_id UUID REFERENCES supply_chain.product_categories(id),
    description TEXT,
    account_id UUID REFERENCES finance.accounts(id),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE supply_chain.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    description TEXT,
    category_id UUID REFERENCES supply_chain.product_categories(id),
    type VARCHAR(20) DEFAULT 'product', -- product, service, consumable
    uom VARCHAR(20) DEFAULT 'unit',
    uom_2 VARCHAR(20),
    conversion_rate DECIMAL(8,2) DEFAULT 1,
    
    -- Pricing
    list_price DECIMAL(12,2) DEFAULT 0,
    cost_price DECIMAL(12,2) DEFAULT 0,
    standard_price DECIMAL(12,2),
    
    -- Inventory
    product_type VARCHAR(20) DEFAULT 'stockable', -- stockable, consumable, service
    tracking_type VARCHAR(20) DEFAULT 'none', -- none, lot, serial
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    
    -- Accounting
    income_account_id UUID REFERENCES finance.accounts(id),
    expense_account_id UUID REFERENCES finance.accounts(id),
    
    image_url VARCHAR(500),
    images JSONB DEFAULT '[]',
    variants JSONB DEFAULT '[]',
    attributes JSONB DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT true,
    is_salable BOOLEAN DEFAULT true,
    is_purchasable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, sku)
);

CREATE TABLE supply_chain.inventory_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) DEFAULT 'internal', -- internal, customer, vendor, inventory, transit
    parent_location_id UUID REFERENCES supply_chain.inventory_locations(id),
    address_id UUID,
    is_scrap_location BOOLEAN DEFAULT false,
    is_return_location BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE supply_chain.stock_quantities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES supply_chain.products(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES supply_chain.inventory_locations(id),
    lot_id UUID, -- For tracked products
    quantity DECIMAL(12,4) DEFAULT 0,
    reserved_quantity DECIMAL(12,4) DEFAULT 0,
    available_quantity GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    package_id UUID,
    last_update TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, product_id, location_id, lot_id)
);

CREATE TABLE supply_chain.stock_moves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255),
    product_id UUID NOT NULL REFERENCES supply_chain.products(id),
    source_location_id UUID REFERENCES supply_chain.inventory_locations(id),
    destination_location_id UUID REFERENCES supply_chain.inventory_locations(id),
    quantity DECIMAL(12,4) NOT NULL,
    unit_cost DECIMAL(12,4),
    reference_type VARCHAR(50), -- purchase_order, sale_order, transfer, adjustment
    reference_id UUID,
    state VARCHAR(20) DEFAULT 'draft', -- draft, waiting, confirmed, done, cancelled
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    done_at TIMESTAMPTZ
);

CREATE TABLE supply_chain.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(20) DEFAULT 'vendor',
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    payment_terms VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'USD',
    price_list VARCHAR(50),
    
    rating DECIMAL(3,2),
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code)
);

CREATE TABLE supply_chain.vendor_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES supply_chain.vendors(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES supply_chain.products(id) ON DELETE CASCADE,
    vendor_sku VARCHAR(100),
    vendor_product_name VARCHAR(255),
    unit_price DECIMAL(12,4),
    minimum_order_qty INTEGER DEFAULT 1,
    lead_time_days INTEGER,
    discount_percent DECIMAL(5,2),
    is_preferred BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, vendor_id, product_id)
);

CREATE TABLE supply_chain.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    vendor_id UUID NOT NULL REFERENCES supply_chain.vendors(id),
    date DATE NOT NULL,
    expected_date DATE,
    delivery_date DATE,
    
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, confirmed, partial, received, cancelled
    
    payment_terms VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'USD',
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    
    notes TEXT,
    terms TEXT,
    
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, order_number)
);

CREATE TABLE supply_chain.purchase_order_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES supply_chain.purchase_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES supply_chain.products(id),
    description VARCHAR(500),
    quantity DECIMAL(12,4) NOT NULL,
    uom VARCHAR(20),
    unit_price DECIMAL(12,4) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL,
    received_quantity DECIMAL(12,4) DEFAULT 0,
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supply_chain.bills_of_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES supply_chain.products(id),
    code VARCHAR(50),
    name VARCHAR(255),
    quantity DECIMAL(8,2) DEFAULT 1,
    routing_id UUID,
    operation_time DECIMAL(8,2),
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    effective_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supply_chain.bom_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_id UUID NOT NULL REFERENCES supply_chain.bills_of_materials(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES supply_chain.products(id),
    quantity DECIMAL(8,2) NOT NULL,
    uom VARCHAR(20),
    sequence INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE supply_chain.service_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES tenants.organizations(id) ON DELETE CASCADE,
    ticket_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- incident, request, complaint
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, pending, resolved, closed
    
    requester_id UUID REFERENCES auth.users(id),
    assigned_to UUID REFERENCES auth.users(id),
    team_id UUID,
    
    sla_deadline TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    
    resolution TEXT,
    feedback_rating INTEGER,
    feedback_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, ticket_number)
);

CREATE TABLE supply_chain.ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES supply_chain.service_tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Tenant isolation
CREATE INDEX idx_users_org ON auth.users(organization_id);
CREATE INDEX idx_employees_org ON hr.employees(organization_id);
CREATE INDEX idx_payroll_org ON payroll.payroll_runs(organization_id);
CREATE INDEX idx_finance_org ON finance.journal_entries(organization_id);
CREATE INDEX idx_productivity_org ON productivity.projects(organization_id);
CREATE INDEX idx_supply_chain_org ON supply_chain.products(organization_id);

-- Performance indexes
CREATE INDEX idx_employees_email ON hr.employees(email);
CREATE INDEX idx_employees_dept ON hr.employees(department_id);
CREATE INDEX idx_leave_requests_employee ON hr.leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON hr.leave_requests(status);
CREATE INDEX idx_payroll_items_run ON payroll.payroll_items(run_id);
CREATE INDEX idx_invoices_partner ON finance.invoices(partner_id);
CREATE INDEX idx_invoices_status ON finance.invoices(status);
CREATE INDEX idx_journal_entries_date ON finance.journal_entries(date);
CREATE INDEX idx_journal_entries_status ON finance.journal_entries(status);
CREATE INDEX idx_tasks_assignee ON productivity.tasks(assignee_id);
CREATE INDEX idx_tasks_project ON productivity.tasks(project_id);
CREATE INDEX idx_products_sku ON supply_chain.products(sku);
CREATE INDEX idx_products_category ON supply_chain.products(category_id);
CREATE INDEX idx_stock_product_location ON supply_chain.stock_quantities(product_id, location_id);
CREATE INDEX idx_purchase_orders_vendor ON supply_chain.purchase_orders(vendor_id);
CREATE INDEX idx_tickets_status ON supply_chain.service_tickets(status);

-- Full-text search indexes
CREATE INDEX idx_products_search ON supply_chain.products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_tasks_search ON productivity.tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Audit log trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_row audit.logs%ROWTYPE;
    current_user_id UUID;
    current_org_id UUID;
BEGIN
    SELECT id, organization_id INTO current_user_id, current_org_id 
    FROM auth.users 
    WHERE email = current_setting('app.current_user_email', true)
    LIMIT 1;
    
    audit_row.organization_id := current_org_id;
    audit_row.user_id := current_user_id;
    audit_row.action := TG_OP;
    audit_row.resource_type := TG_TABLE_NAME;
    audit_row.resource_id := NEW.id;
    audit_row.created_at := NOW();
    
    IF TG_OP = 'UPDATE' THEN
        audit_row.old_values := to_jsonb(OLD);
        audit_row.new_values := to_jsonb(NEW);
    ELSIF TG_OP = 'INSERT' THEN
        audit_row.new_values := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        audit_row.old_values := to_jsonb(OLD);
    END IF;
    
    INSERT INTO audit.logs VALUES (audit_row.*);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamps
CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenants_orgs_updated_at BEFORE UPDATE ON tenants.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hr_employees_updated_at BEFORE UPDATE ON hr.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_runs_updated_at BEFORE UPDATE ON payroll.payroll_runs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_finance_entries_updated_at BEFORE UPDATE ON finance.journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON supply_chain.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEEDS
-- ============================================================================

-- Default organization (Super Admin)
INSERT INTO tenants.organizations (id, name, slug, subscription_plan, subscription_status)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'System', 'system', 'enterprise', 'active')
ON CONFLICT (id) DO NOTHING;

-- Default roles for organizations
INSERT INTO auth.roles (id, organization_id, name, code, description, level, is_system)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'System Admin', 'system_admin', 'Full system access', 100, true),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'HR Manager', 'hr_manager', 'HR management access', 80, false),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Finance Manager', 'finance_manager', 'Finance management access', 80, false),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Operations Manager', 'operations_manager', 'Operations management access', 70, false),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Employee', 'employee', 'Basic employee access', 10, false)
ON CONFLICT DO NOTHING;

-- Default admin user (password: Admin@123)
INSERT INTO auth.users (id, organization_id, email, password_hash, first_name, last_name, role, is_active, is_verified)
VALUES 
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin@erp.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System', 'Admin', 'system_admin', true, true)
ON CONFLICT DO NOTHING;

-- Assign admin role
INSERT INTO auth.user_roles (user_id, role_id)
SELECT '20000000-0000-0000-0000-000000000001', id 
FROM auth.roles 
WHERE code = 'system_admin'
ON CONFLICT DO NOTHING;
