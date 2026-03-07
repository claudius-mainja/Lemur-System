# OpenERP Enterprise - System Design Document

## 1. Executive Summary

**Project Name:** OpenERP Enterprise  
**Type:** All-in-one Web-Based ERP System  
**Target:** Small to Medium Enterprises (SMEs)  
**License:** Open Source (AGPLv3 / Commercial dual-license)

---

## 2. Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER (SPA)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │ Mobile Web  │  │   PWA       │  │Dashboard    │        │
│  │  (React)    │  │  (Responsive)│ │  (Offline)  │  │ (Real-time) │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼───────────────┘
          │                │                │                │
          └────────────────┴────────┬───────┴────────────────┘
                                     │ HTTPS/WSS
┌────────────────────────────────────┼────────────────────────────────────────┐
│                         API GATEWAY / LOAD BALANCER                         │
│                    (Nginx / Kong / AWS API Gateway)                        │
│         ┌──────────────┬───────────┴───────────┬──────────────┐           │
│         │ Rate Limiter │ Authentication/JWT    │ Cache Layer  │           │
│         └──────────────┴───────────────────────┴──────────────┘           │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                         APPLICATION LAYER                                    │
│  ┌──────────────────────────────────┼──────────────────────────────────┐   │
│  │                    MICROSERVICES / MODULES                            │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │   │
│  │  │   Auth     │ │    HR      │ │  Payroll   │ │  Finance   │        │   │
│  │  │  Service   │ │  Service   │ │  Service   │ │  Service   │        │   │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │   │
│  │  │ Product.   │ │  Supply    │ │  Audit    │ │  Report    │        │   │
│  │  │  Service   │ │  Chain     │ │  Service   │ │  Service   │        │   │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                         DATA LAYER                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  PostgreSQL     │  │   Redis         │  │  Elasticsearch  │             │
│  │  (Primary DB)   │  │  (Cache/Session)│  │  (Search/Logs)  │             │
│  │  - Core Data    │  │  - Sessions     │  │  - Audit Logs   │             │
│  │  - Transactions │  │  - Real-time    │  │  - Analytics    │             │
│  │  - Relational  │  │  - Pub/Sub      │  │  - Full-text    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  Optional:                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                                 │
│  │   MongoDB       │  │  InfluxDB       │                                 │
│  │  (Logs/Analytics)│ │ (Time-series)   │                                 │
│  └─────────────────┘  └─────────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-------------|---------|
| **Frontend** | React 18 + TypeScript | SPA with SSR capability |
| **State Management** | Zustand / TanStack Query | Lightweight, optimized for low-bandwidth |
| **UI Framework** | TailwindCSS + Radix UI | Responsive, accessible components |
| **Backend** | Node.js (NestJS) / Python (FastAPI) | RESTful + GraphQL APIs |
| **API Gateway** | Kong / Nginx | Rate limiting, routing, caching |
| **Primary DB** | PostgreSQL 15+ | Relational data, ACID compliance |
| **Cache** | Redis 7+ | Sessions, real-time data, pub/sub |
| **Search/Logs** | Elasticsearch | Full-text search, audit logs |
| **Message Queue** | RabbitMQ | Async processing, event-driven |
| **Container** | Docker + Kubernetes | Orchestration, scaling |

---

## 3. Core Modules and Responsibilities

### 3.1 Module Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE MODULES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    SHARED SERVICES                                  │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │   │
│  │  │  Auth &    │ │  RBAC     │ │  Audit    │ │  Notifi-   │        │   │
│  │  │  Security  │ │  Service  │ │  Logging  │ │  cations   │        │   │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐│
│  │   Human    │ │  Payroll   │ │ Financial  │ │Productivity│ │ Supply ││
│  │ Resources  │ │ Management │ │ Services   │ │   Tools    │ │ Chain  ││
│  │            │ │            │ │            │ │            │ │        ││
│  │ • Employee │ │ • Salary   │ │ • GL       │ │ • Documents│ │ • Inv. ││
│  │   Records  │ │ • Benefits │ │ • AP/AR   │ │ • Tasks    │ │ • PO   ││
│  │ • Leave    │ │ • Tax      │ │ • Assets   │ │ • Calendar │ │ • BOM  ││
│  │ • Recruit  │ │ • Reports  │ │ • Budget   │ │ • Chat     │ │ • MRP  ││
│  │ • Training │ │ • Direct   │ │ • Reports  │ │ • Wiki     │ │ • Vend.││
│  │            │ │   Deposit  │            │ │ │ │            │        ││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └─────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Module Breakdown

#### A. Authentication & Security Module (Auth Service)

```
┌─────────────────────────────────────────────┐
│         AUTH & SECURITY MODULE              │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ • User authentication (JWT + Refresh Token) │
│ • Multi-factor authentication (TOTP, SMS)   │
│ • OAuth2 / SSO integration (SAML, LDAP)    │
│ • Password policies and encryption         │
│ • Session management                        │
│ • Account lockout policies                  │
│                                             │
│ Components:                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ AuthController  │ Login, Logout, MFA    │ │
│ │ AuthService    │ Token generation      │ │
│ │ PasswordService│ Hashing, validation   │ │
│ │ MFAService     │ TOTP, SMS handling    │ │
│ │ SessionService │ Session lifecycle     │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Database Schema:**
```sql
-- Core tables
users (id, email, password_hash, role, department_id, is_active, mfa_enabled, created_at, updated_at)
user_sessions (id, user_id, token_hash, ip_address, user_agent, expires_at, created_at)
refresh_tokens (id, user_id, token_hash, expires_at, revoked_at)
mfa_configurations (id, user_id, type, secret, backup_codes, is_active)
login_attempts (id, user_id, ip_address, success, attempted_at)
```

#### B. Human Resources Module (HR Service)

```
┌─────────────────────────────────────────────┐
│          HUMAN RESOURCES MODULE             │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ • Employee lifecycle management             │
│ • Leave request and approval workflows      │
│ • Recruitment and applicant tracking        │
│ • Employee benefits administration          │
│ • Training and certification tracking        │
│ • Performance reviews                       │
│                                             │
│ Sub-modules:                                │
│ ┌─────────────────────────────────────────┐ │
│ │ Employee Management    │ Directory     │ │
│ │ Leave Management       │ Self-service  │ │
│ │ Recruitment            │ Onboarding    │ │
│ │ Training               │ Performance   │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Database Schema:**
```sql
employees (id, user_id, employee_number, first_name, last_name, email, phone, 
           hire_date, termination_date, department_id, job_title, manager_id, 
           employment_type, status, photo_url, personal_info_encrypted)

departments (id, name, code, parent_id, manager_id, budget, cost_center)

jobs (id, title, description, department_id, pay_grade, requirements)

leave_types (id, name, code, accrual_rate, max_balance, requires_approval)

leave_requests (id, employee_id, leave_type_id, start_date, end_date, 
                reason, status, approver_id, approved_at, created_at)

leave_balances (id, employee_id, leave_type_id, year, total_days, used_days, 
                pending_days, carry_over_days)

recruitment_jobs (id, title, department_id, description, requirements, 
                   status, posted_date, closing_date)

applicants (id, job_id, first_name, last_name, email, phone, resume_url, 
            status, applied_at, source)
```

#### C. Payroll Management Module

```
┌─────────────────────────────────────────────┐
│         PAYROLL MANAGEMENT MODULE           │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ • Salary structure and configuration        │
│ • Payroll processing and execution          │
│ • Tax calculation and deduction            │
│ • Benefits administration                   │
│ • Direct deposit management                  │
│ • Payroll reports and compliance            │
│ • Year-end tax forms (W-2, 1099)            │
│                                             │
│ Components:                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ PayrollProcessor   │ Batch processing  │ │
│ │ TaxCalculator      │ Multi-tax support │ │
│ │ SalaryStructureMgr │ Grades & steps     │ │
│ │ DeductionManager   │ Benefits, loans   │ │
│ │ DirectDepositSvc   │ ACH processing     │ │
│ │ ReportGenerator    │ Compliance reports │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Database Schema:**
```sql
salary_structures (id, name, description, effective_date, is_active)

salary_structure_lines (id, structure_id, rule_id, amount, percentage, sequence)

payroll_rules (id, name, code, type, formula, applies_to, priority, is_active)

employee_contracts (id, employee_id, structure_id, start_date, end_date, 
                    base_salary, working_hours, pay_frequency, bank_details_encrypted)

payroll_runs (id, period_start, period_end, status, processed_by, processed_at, 
              total_gross, total_deductions, total_net)

payroll_items (id, run_id, employee_id, earnings, deductions, gross, net, 
               tax_withheld, status)

tax_configurations (id, country, state, tax_type, brackets JSON, effective_date)

deductions (id, employee_id, type, amount, start_date, end_date, is_recurring)
```

#### D. Financial Services Module

```
┌─────────────────────────────────────────────┐
│         FINANCIAL SERVICES MODULE           │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ • General ledger and accounting             │
│ • Accounts payable management               │
│ • Accounts receivable management            │
│ • Fixed assets tracking                     │
│ • Budget management and tracking            │
│ • Financial reporting (P&L, Balance Sheet)  │
│ • Bank reconciliation                       │
│ • Multi-currency support                    │
│                                             │
│ Components:                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ GeneralLedger    │ Journal entries     │ │
│ │ AccountsPayable  │ Vendor invoices     │ │
│ │ AccountsReceivable│ Customer invoices   │ │
│ │ AssetManager     │ Depreciation        │ │
│ │ BudgetManager    │ Variance analysis  │ │
│ │ ReportGenerator  │ Financial statements│ │
│ │ BankReconciliation│ Statement matching │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Database Schema:**
```sql
accounts (id, code, name, type, parent_id, is_active, allow_reconciliation, 
          tax_code, currency)

journal_entries (id, entry_number, date, description, status, posted_by, 
                 posted_at, source_document, total_debit, total_credit)

journal_lines (id, entry_id, account_id, debit, credit, analytic_account_id, 
               partner_id, description, tax_line_id)

partners (id, name, type, email, phone, address, tax_id, payment_terms, 
          credit_limit, is_vendor, is_customer)

invoices (id, number, partner_id, type, date, due_date, status, subtotal, 
          tax_amount, total, currency, payment_terms, entries_count)

payments (id, date, partner_id, amount, currency, payment_type, reference, 
           journal_id, reconciliation_ids)

fixed_assets (id, name, category_id, purchase_date, purchase_value, salvage_value, 
              depreciation_method, useful_life, accumulated_depreciation, status)

budgets (id, name, fiscal_year, department_id, status, total_budget, 
         allocated_amount, created_by)

budget_lines (id, budget_id, account_id, planned_amount, actual_amount, 
              variance, period)
```

#### E. Productivity Tools Module

```
┌─────────────────────────────────────────────┐
│         PRODUCTIVITY TOOLS MODULE           │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ • Document management and storage           │
│ • Task and project management               │
│ • Calendar and scheduling                   │
│ • Real-time collaboration (chat, comments)  │
│ • Knowledge base / Wiki                     │
│ • Email integration                         │
│                                             │
│ Components:                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ DocumentService   │ Upload, version    │ │
│ │ TaskManager       │ Kanban, Gantt       │ │
│ │ CalendarService   │ Events, reminders   │ │
│ │ ChatService       │ Real-time messaging │ │
│ │ WikiService       │ Markdown, search    │ │
│ │ NotificationSvc   │ Email, in-app      │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Database Schema:**
```sql
documents (id, name, path, mime_type, size, owner_id, folder_id, 
           is_shared, permissions, current_version, created_at, updated_at)

document_versions (id, document_id, version_number, path, size, 
                   uploaded_by, created_at, change_summary)

folders (id, name, parent_id, owner_id, permissions, created_at)

tasks (id, title, description, project_id, assignee_id, status, priority, 
       start_date, due_date, estimated_hours, actual_hours, progress, 
       parent_task_id, created_by, created_at)

projects (id, name, description, owner_id, status, start_date, end_date, 
          budget, progress, customer_id, created_at)

calendar_events (id, title, description, start_time, end_time, all_day, 
                 organizer_id, location, recurrence_rule, reminders)

messages (id, channel_id, sender_id, content, attachments, created_at, 
          is_edited, reply_to_id)

channels (id, name, type, is_private, members, created_by, created_at)

wiki_pages (id, title, content, space_id, parent_id, author_id, 
            created_at, updated_at, version)
```

#### F. Supply Chain & Services Management Module

```
┌─────────────────────────────────────────────┐
│    SUPPLY CHAIN & SERVICES MANAGEMENT       │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ • Inventory management and tracking         │
│ • Purchase order management                  |
│ • Bill of Materials (BOM)                   │
│ • Material Requirements Planning (MRP)      │
 Vendor management                            │
 • Service request and ticket management      │
 • Delivery and fulfillment tracking          │
│                                             │
│ Components:                                 │
│ ┌─────────────────────────────────────────┐ │
│ │ InventoryService  │ Stock, locations   │ │
│ │ PurchaseOrderSvc  │ RFQ, PO, receiving │ │
│ │ BOMService        │ Manufacturing      │ │
│ │ MRPCalculator    │ Demand planning    │ │
│ │ VendorManagement │ Performance, RFQ   │ │
│ │ ServiceDesk      │ Tickets, SLA       │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Database Schema:**
```sql
products (id, name, sku, description, category_id, type, uom_id, 
          list_price, cost_price, min_stock, max_stock, is_active)

product_categories (id, name, parent_id, code, account_id)

inventory_locations (id, name, type, parent_id, address_id, is_scrap_location)

stock_quantities (id, product_id, location_id, quantity, reserved_quantity, 
                  lot_id, package_id, last_update)

purchase_orders (id, number, vendor_id, date, expected_date, status, 
                 payment_terms, currency, total, approved_by, created_by)

purchase_order_lines (id, order_id, product_id, description, quantity, 
                      uom_id, unit_price, taxes, total, received_qty)

bills_of_materials (id, product_id, code, name, quantity, 
                    is_active, version, effective_date)

bom_lines (id, bom_id, product_id, quantity, operation_id)

service_tickets (id, number, title, description, requester_id, 
                 assignee_id, priority, status, category, sla_deadline, 
                 created_at, resolved_at)

vendors (id, name, code, email, phone, address, tax_id, payment_terms, 
         rating, status, created_at)

vendor_products (id, vendor_id, product_id, vendor_sku, unit_price, 
                 lead_time, minimum_order_qty)
```

---

## 4. Data Flow Between Modules

### 4.1 Inter-Module Communication

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MESSAGE QUEUE (RabbitMQ)                            │
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│  │ employee │───▶│ payroll  │───▶│ finance  │───▶│  audit   │            │
│  │ created  │    │  run     │    │  posted  │    │  log     │            │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘            │
│       │               │               │                                    │
│       ▼               ▼               ▼                                    │
│  ┌──────────────────────────────────────────────────────────────┐          │
│  │                    EVENT BUS (Internal)                       │          │
│  │  • employee.created    • payroll.processed    • invoice.paid │          │
│  │  • leave.approved      • asset.depreciated    • stock.low    │          │
│  │  • document.shared     • vendor.selected      • ticket.created│          │
│  └──────────────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Key Data Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXAMPLE: NEW EMPLOYEE ONBOARDING                        │
└─────────────────────────────────────────────────────────────────────────────┘

HR Module                    Payroll Module              Finance Module
     │                            │                            │
     │  1. Create Employee        │                            │
     ├───────────────────────────▶│                            │
     │                            │                            │
     │                            │  2. Create Salary Struct  │
     │                            ├───────────────────────────▶
     │                            │                            │
     │                            │                            │  3. Create GL Accounts
     │                            │◀───────────────────────────
     │                            │                            │
     │  4. Generate User Account  │                            │
     ├───────────────────────────▶│                            │
     │                            │                            │
     │  5. Assign to Department   │                            │
     ├────────────────────────────────────────────────────────▶
     │                            │                            │
     │  6. Notify (Email/Push)    │                            │
     ├────────────────────────────────────────────────────────▶
     │                            │                            │
     │  7. Log Audit Trail        │                            │
     └───────────────────────────▶───────────────────────────▶ Audit Service
```

### 4.3 Real-Time Data Flow

```
┌─────────────┐     WebSocket      ┌─────────────┐     Redis Pub/Sub     ┌─────────────┐
│   Client    │◀───────────────────▶│  API GW     │◀─────────────────────▶│  Services   │
│  (Browser)  │                     │  (Socket.io)│                       │  (Events)   │
└─────────────┘                     └─────────────┘                       └─────────────┘
      │                                    │                                    │
      │ Updates:                           │ Events:                            │
      │ • Dashboard KPIs                  │ • inventory.low                    │
      │ • Notifications                    │ • task.assigned                    │
      │ • Chat messages                   │ • leave.approved                   │
      │ • Stock alerts                    │ • payment.received                │
      │ • Real-time reports               │ • ticket.updated                   │
└─────────────┘                            └─────────────┘                       └─────────────┘
```

---

## 5. API Structure and Key Endpoints

### 5.1 API Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API STRUCTURE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RESTful Endpoints (Primary)                                               │
│  ─────────────────────────────────                                          │
│  GET    /api/v1/{resource}              List resources (paginated)         │
│  GET    /api/v1/{resource}/:id          Get single resource                │
│  POST   /api/v1/{resource}              Create new resource               │
│  PUT    /api/v1/{resource}/:id          Update resource (full)             │
│  PATCH  /api/v1/{resource}/:id          Partial update                     │
│  DELETE /api/v1/{resource}/:id          Delete resource                    │
│                                                                             │
│  GraphQL Endpoint (Alternative)                                            │
│  ─────────────────────────────────                                          │
│  POST   /graphql                      Flexible queries & mutations        │
│  POST   /graphql/schema               Introspection                       │
│                                                                             │
│  Special Endpoints                                                          │
│  ─────────────────────────────────                                          │
│  GET    /api/v1/reports/:type         Generate reports                    │
│  POST   /api/v1/import/:resource      Bulk import (CSV/Excel)             │
│  GET    /api/v1/export/:resource      Bulk export                         │
│  WS     /ws                           Real-time updates                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/login` | User login | Public |
| POST | `/api/v1/auth/logout` | User logout | Auth |
| POST | `/api/v1/auth/refresh` | Refresh token | Auth |
| POST | `/api/v1/auth/mfa/setup` | Enable MFA | Auth |
| POST | `/api/v1/auth/mfa/verify` | Verify MFA | Auth |
| POST | `/api/v1/auth/password/reset` | Password reset request | Public |
| POST | `/api/v1/auth/password/change` | Change password | Auth |
| GET | `/api/v1/auth/me` | Current user profile | Auth |
| POST | `/api/v1/auth/sso/saml` | SAML SSO login | Public |

### 5.3 HR Module Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/employees` | List employees |
| GET | `/api/v1/employees/:id` | Get employee details |
| POST | `/api/v1/employees` | Create employee |
| PATCH | `/api/v1/employees/:id` | Update employee |
| GET | `/api/v1/employees/:id/documents` | Employee documents |
| GET | `/api/v1/leave-requests` | List leave requests |
| POST | `/api/v1/leave-requests` | Submit leave request |
| PATCH | `/api/v1/leave-requests/:id/approve` | Approve leave |
| GET | `/api/v1/leave-balances/:employeeId` | Leave balances |
| GET | `/api/v1/recruitment/jobs` | List open positions |
| POST | `/api/v1/recruitment/jobs` | Create job posting |
| GET | `/api/v1/recruitment/applicants` | List applicants |
| POST | `/api/v1/recruitment/applicants` | Add applicant |

### 5.4 Payroll Module Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/payroll/structures` | List salary structures |
| POST | `/api/v1/payroll/structures` | Create salary structure |
| GET | `/api/v1/payroll/contracts/:employeeId` | Employee contract |
| POST | `/api/v1/payroll/run` | Run payroll |
| GET | `/api/v1/payroll/runs` | List payroll runs |
| GET | `/api/v1/payroll/runs/:id` | Payroll run details |
| POST | `/api/v1/payroll/runs/:id/approve` | Approve payroll |
| GET | `/api/v1/payroll/payslips/:employeeId` | Employee payslips |
| GET | `/api/v1/payroll/reports/summary` | Payroll summary |
| GET | `/api/v1/payroll/tax/config` | Tax configurations |

### 5.5 Finance Module Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/finance/accounts` | Chart of accounts |
| POST | `/api/v1/finance/entries` | Create journal entry |
| GET | `/api/v1/finance/entries` | List journal entries |
| POST | `/api/v1/finance/entries/:id/post` | Post journal entry |
| GET | `/api/v1/finance/invoices` | List invoices |
| POST | `/api/v1/finance/invoices` | Create invoice |
| POST | `/api/v1/finance/invoices/:id/pay` | Register payment |
| GET | `/api/v1/finance/reports/balance-sheet` | Balance sheet |
| GET | `/api/v1/finance/reports/profit-loss` | P&L report |
| GET | `/api/v1/finance/reports/cash-flow` | Cash flow |
| GET | `/api/v1/finance/assets` | Fixed assets list |
| POST | `/api/v1/finance/assets/:id/depreciate` | Run depreciation |

### 5.6 Supply Chain Module Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/inventory/products` | List products |
| POST | `/api/v1/inventory/products` | Create product |
| GET | `/api/v1/inventory/stock` | Stock levels |
| POST | `/api/v1/inventory/transfer` | Stock transfer |
| GET | `/api/v1/purchase/orders` | List purchase orders |
| POST | `/api/v1/purchase/orders` | Create PO |
| PATCH | `/api/v1/purchase/orders/:id/approve` | Approve PO |
| POST | `/api/v1/purchase/orders/:id/receive` | Receive goods |
| GET | `/api/v1/manufacturing/boms` | Bills of Materials |
| POST | `/api/v1/manufacturing/orders` | Manufacturing orders |
| GET | `/api/v1/service/tickets` | Service tickets |
| POST | `/api/v1/service/tickets` | Create ticket |

### 5.7 Productivity Module Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/documents` | List documents |
| POST | `/api/v1/documents` | Upload document |
| GET | `/api/v1/documents/:id/download` | Download |
| GET | `/api/v1/tasks` | List tasks |
| POST | `/api/v1/tasks` | Create task |
| PATCH | `/api/v1/tasks/:id` | Update task |
| GET | `/api/v1/projects` | List projects |
| GET | `/api/v1/calendar/events` | Calendar events |
| POST | `/api/v1/calendar/events` | Create event |
| GET | `/api/v1/chat/channels` | Chat channels |
| POST | `/api/v1/chat/messages` | Send message |

### 5.8 GraphQL Schema Overview

```graphql
type Query {
  # Employees
  employees(filter: EmployeeFilter, pagination: Pagination): EmployeeConnection!
  employee(id: ID!): Employee
  
  # Payroll
  payrollRuns(filter: PayrollRunFilter): [PayrollRun!]!
  payslip(employeeId: ID!, period: PeriodInput!): Payslip
  
  # Finance
  journalEntries(filter: JournalEntryFilter): JournalEntryConnection!
  financialReport(type: ReportType!, period: PeriodInput!): FinancialReport!
  
  # Supply Chain
  products(filter: ProductFilter): ProductConnection!
  inventoryByLocation(locationId: ID!): [StockQuantity!]!
  
  # Productivity
  myTasks(status: TaskStatus): [Task!]!
  projectTasks(projectId: ID!): [Task!]!
}

type Mutation {
  # Auth
  login(input: LoginInput!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  
  # HR
  createEmployee(input: EmployeeInput!): Employee!
  approveLeaveRequest(id: ID!, input: ApprovalInput!): LeaveRequest!
  
  # Payroll
  runPayroll(input: PayrollRunInput!): PayrollRun!
  
  # Finance
  createJournalEntry(input: JournalEntryInput!): JournalEntry!
  postJournalEntry(id: ID!): JournalEntry!
  
  # Supply Chain
  createPurchaseOrder(input: POInput!): PurchaseOrder!
  receiveGoods(orderId: ID!, lines: [ReceiveLineInput!]!): PurchaseOrder!
}

type Subscription {
  # Real-time updates
  taskUpdated(projectId: ID!): Task!
  newNotification: Notification!
  stockAlert: StockAlert!
  chatMessage(channelId: ID!): ChatMessage!
}
```

---

## 6. User Roles and Permissions

### 6.1 Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ROLE HIERARCHY                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           ┌─────────────┐                                   │
│                           │   SYSTEM    │                                   │
│                           │   ADMIN     │                                   │
│                           └──────┬──────┘                                   │
│                                  │                                           │
│        ┌─────────────────────────┼─────────────────────────┐               │
│        │                         │                         │               │
│   ┌────┴────┐              ┌──────┴──────┐          ┌──────┴──────┐        │
│   │    HR   │              │   FINANCE   │          │  OPERATIONS │        │
│   │  ADMIN  │              │   ADMIN     │          │   MANAGER   │        │
│   └────┬────┘              └──────┬──────┘          └──────┬──────┘        │
│        │                         │                         │               │
│   ┌────┴────┐              ┌──────┴──────┐          ┌──────┴──────┐        │
│   │    HR   │              │  ACCOUNTANT  │          │  WAREHOUSE  │        │
│   │ MANAGER │              │              │          │   SUPERVISOR│        │
│   └────┬────┘              └──────┬──────┘          └──────┬──────┘        │
│        │                         │                         │               │
│   ┌────┴────┐              ┌──────┴──────┐          ┌──────┴──────┐        │
│   │  HR     │              │    FINANCE  │          │   EMPLOYEE  │        │
│   │ SPECIALIST             │   CLERK     │          │   (Base)    │        │
│   └─────────┘              └─────────────┘          └─────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Permission Matrix

| Module | Permission | System Admin | HR Admin | Finance Admin | Operations | Employee |
|--------|------------|--------------|----------|---------------|------------|----------|
| **Auth** | Manage Users | ✓ | - | - | - | - |
| | Manage Roles | ✓ | - | - | - | - |
| **HR** | View All Employees | ✓ | ✓ | - | - | - |
| | Create Employee | ✓ | ✓ | - | - | - |
| | Edit Employee | ✓ | ✓ | - | - | - |
| | View Self | ✓ | ✓ | ✓ | ✓ | ✓ |
| | Edit Self | - | - | - | - | ✓ |
| | Approve Leave | ✓ | ✓ | - | ✓ | - |
| | Manage Recruitment | ✓ | ✓ | - | - | - |
| **Payroll** | View All | ✓ | ✓ | ✓ | - | - |
| | Run Payroll | ✓ | - | ✓ | - | - |
| | View Own Payslip | ✓ | ✓ | ✓ | ✓ | ✓ |
| | Approve Payroll | ✓ | - | ✓ | - | - |
| **Finance** | View All | ✓ | - | ✓ | - | - |
| | Create Entries | ✓ | - | ✓ | - | - |
| | Post Entries | ✓ | - | ✓ | - | - |
| | Manage Assets | ✓ | - | ✓ | - | - |
| | View Reports | ✓ | - | ✓ | ✓ | - |
| **Productivity** | View All Projects | ✓ | ✓ | ✓ | ✓ | - |
| | Manage Documents | ✓ | ✓ | ✓ | ✓ | ✓ |
| | Manage Tasks | ✓ | ✓ | ✓ | ✓ | ✓ |
| | View Calendar | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Supply Chain** | View Inventory | ✓ | - | ✓ | ✓ | - |
| | Manage Inventory | ✓ | - | - | ✓ | - |
| | Create PO | ✓ | - | ✓ | ✓ | - |
| | Approve PO | ✓ | - | ✓ | - | - |
| | Manage Vendors | ✓ | - | ✓ | ✓ | - |
| | Service Tickets | ✓ | ✓ | ✓ | ✓ | ✓ |

### 6.3 Database Schema for RBAC

```sql
roles (id, name, code, description, level, parent_role_id, is_system, 
       created_at, updated_at)

permissions (id, name, code, module, action, description)

role_permissions (id, role_id, permission_id, granted_by, created_at)

user_roles (id, user_id, role_id, department_id, granted_by, granted_at, 
            expires_at)

departmental_permissions (id, role_id, department_id, permission_id, 
                          scope, granted_by, granted_at)
```

---

## 7. Deployment Model

### 7.1 Deployment Options

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT ARCHITECTURES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ON-PREMISE DEPLOYMENT                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   Docker     │  │  Kubernetes  │  │   Single    │               │   │
│  │  │   Compose    │  │   (K3s)      │  │   Server    │               │   │
│  │  │ (SME < 50)  │  │ (Mid-size)   │  │  (Demo)     │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CLOUD DEPLOYMENT                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   AWS        │  │   Azure     │  │  Self-hosted │               │   │
│  │  │ (ECS/EKS)    │  │ (AKS)       │  │  (VM/Bare    │               │   │
│  │  │              │  │             │  │   Metal)     │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    HYBRID DEPLOYMENT                               │   │
│  │  ┌─────────────────────┐  ┌───────────────────────────────────┐     │   │
│  │  │  On-premise        │  │  Cloud                            │     │   │
│  │  │  (Sensitive Data)  │  │  (App, Cache, Backup)             │     │   │
│  │  └─────────────────────┘  └───────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Docker Compose (SME Deployment)

```yaml
version: '3.9'

services:
  # API Gateway
  gateway:
    image: nginx:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - erp-network

  # Backend API
  api:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/erp
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
    networks:
      - erp-network
    deploy:
      replicas: 2

  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://gateway
    depends_on:
      - api
    networks:
      - erp-network

  # Primary Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=erp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - erp-network

  # Cache & Session
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data
    networks:
      - erp-network

  # Search & Logs
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=true
      - ELASTIC_PASSWORD=${ES_PASSWORD}
    volumes:
      - esdata:/usr/share/elasticsearch/data
    networks:
      - erp-network

  # Message Queue
  rabbitmq:
    image: rabbitmq:3-management-alpine
    environment:
      - RABBITMQ_DEFAULT_USER=${RABBITMQ_USER}
      - RABBITMQ_DEFAULT_PASS=${RABBITMQ_PASSWORD}
    volumes:
      - rabbitmqdata:/var/lib/rabbitmq
    networks:
      - erp-network

volumes:
  pgdata:
  redisdata:
  esdata:
  rabbitmqdata:

networks:
  erp-network:
    driver: bridge
```

### 7.3 Kubernetes Deployment (Cloud)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: erp-api
  namespace: erp-system
spec:
  replicas: 3
  selector:
    matchLabels:
      app: erp-api
  template:
    metadata:
      labels:
        app: erp-api
    spec:
      containers:
      - name: api
        image: erp/api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: erp-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: erp-api
  namespace: erp-system
spec:
  selector:
    app: erp-api
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: erp-ingress
  namespace: erp-system
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - erp.example.com
    secretName: erp-tls
  rules:
  - host: erp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: erp-api
            port:
              number: 80
```

---

## 8. Scalability and Performance Strategy

### 8.1 Horizontal Scaling Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     HORIZONTAL SCALING ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          ┌──────────────┐                                   │
│                          │ Load Balancer│                                   │
│                          │  (HAProxy)   │                                   │
│                          └──────┬───────┘                                   │
│                                 │                                           │
│      ┌────────────┬────────────┼────────────┬────────────┐               │
│      │            │            │            │            │               │
│      ▼            ▼            ▼            ▼            ▼               │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│ │API Pod 1│  │API Pod 2│  │API Pod 3│  │API Pod 4│  │API Pod N│        │
│ └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│      │            │            │            │            │               │
│      └────────────┴────────────┼────────────┴────────────┘               │
│                                 │                                           │
│                    ┌────────────┴────────────┐                             │
│                    │     Message Queue       │                             │
│                    │     (RabbitMQ Cluster)   │                             │
│                    └────────────┬────────────┘                             │
│                                 │                                           │
│      ┌────────────┬────────────┼────────────┬────────────┐               │
│      ▼            ▼            ▼            ▼            ▼               │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│ │Worker 1 │  │Worker 2 │  │Worker 3 │  │Worker 4 │  │Worker N │        │
│ │(Payroll)│  │(Reports)│  │(Import) │  │(Export) │  │(Async)  │        │
│ └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Database Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DATABASE SCALING STRATEGY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     READ SCALING (Read Replicas)                   │   │
│  │                                                                   │   │
│  │      ┌──────────┐                                                │   │
│  │      │  Primary │◄──────── Write (Sync)                           │   │
│  │      │  (Write)  │                                                │   │
│  │      └─────┬─────┘                                                │   │
│  │            │ Async Replication                                    │   │
│  │      ┌─────┴─────┐    ┌──────────┐    ┌──────────┐             │   │
│  │      ▼            ▼    ▼          ▼    ▼          ▼             │   │
│  │  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐            │   │
│  │  │Replica1│   │Replica2│   │Replica3│   │ReplicaN│            │   │
│  │  │ (Read) │   │ (Read) │   │ (Read) │   │ (Read) │            │   │
│  │  └────────┘   └────────┘   └────────┘   └────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     SHARDING (For Massive Scale)                    │   │
│  │                                                                   │   │
│  │   Shard Key: company_id or region                                 │   │
│  │                                                                   │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │   │
│  │  │ Shard 1   │ │ Shard 2   │ │ Shard 3   │ │ Shard N   │        │   │
│  │  │ (Comp 1-100)│(Comp 101-200)│(Comp 201-300)│(Comp N)   │        │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     CACHING STRATEGY                                │   │
│  │                                                                   │   │
│  │  L1: In-memory (Redis) - Hot data, sessions                       │   │
│  │  L2: CDN - Static assets, reports                                  │   │
│  │  L3: Application cache - Query results                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Performance Optimizations

| Optimization | Implementation | Impact |
|--------------|---------------|--------|
| **Database Indexing** | Composite indexes on frequently queried columns | 50-90% query improvement |
| **Query Optimization** | N+1 prevention, batch loading, connection pooling | Reduced DB load |
| **Caching** | Redis for frequently accessed data, 5-15 min TTL | 80% cache hit rate target |
| **CDN** | Static assets served via CDN | Reduced latency globally |
| **Compression** | Gzip/Brotli for API responses | 60-70% size reduction |
| **Lazy Loading** | Paginated lists, virtual scrolling | Faster initial load |
| **Code Splitting** | Route-based splitting in SPA | Smaller JS bundles |
| **Service Workers** | PWA offline support | Works offline |
| **WebSockets** | Real-time updates (not polling) | Reduced bandwidth |
| **Background Jobs** | Heavy processing via message queue | Async, non-blocking |
| **Database Connection Pooling** | PgBouncer / HikariCP | Efficient DB connections |

### 8.4 Low-Bandwidth Optimizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   LOW-BANDWIDTH OPTIMIZATIONS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DATA COMPRESSION                                                       │
│     ├── API Response Compression (Brotli)     - 70% reduction             │
│     ├── Delta Sync (only changes)            - 90%+ reduction            │
│     └── Field Selection (sparse fields)      - Selective response        │
│                                                                             │
│  2. OFFLINE-FIRST PWA                                                     │
│     ├── Service Workers for caching           - Offline access            │
│     ├── IndexedDB for local storage           - Full offline support      │
│     ├── Background Sync                        - Queued operations        │
│     └── Conflict Resolution                   - Smart merge               │
│                                                                             │
│  3. EFFICIENT PROTOCOLS                                                   │
│     ├── HTTP/2 Multiplexing                    - Single connection         │
│     ├── HTTP/3 (QUIC)                          - Faster on lossy networks  │
│     └── gRPC (optional)                        - Binary, smaller payloads │
│                                                                             │
│  4. UI OPTIMIZATIONS                                                       │
│     ├── Virtual Scrolling                      - Large lists              │
│     ├── Image Optimization (WebP, AVIF)       - Smaller images            │
│     ├── Skeleton Screens                       - Perceived performance    │
│     └── Minimal JS Bundles (tree-shaking)     - Less code to download     │
│                                                                             │
│  5. SYNC STRATEGIES                                                        │
│     ├── Delta Sync (changes only)              - Minimal bandwidth        │
│     ├── Batch Operations                       - Single request           │
│     ├── Compression before upload              - Smaller uploads          │
│     └── Compressed delta sync intervals        - Adaptive                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Open-Source Structure (Plugin-Based Architecture)

### 9.1 Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PLUGIN-BASED ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CORE FRAMEWORK                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                  │   │
│  │  │   Plugin    │ │   Event     │ │    UI       │                  │   │
│  │  │   Loader    │ │    Bus      │ │   Registry  │                  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                  │   │
│  │  │   Database  │ │    Auth     │ │   Config    │                  │   │
│  │  │   Migrations│ │   Provider  │ │   Store     │                  │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      CORE MODULES (Required)                        │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│  │  │   Auth  │ │   Users │ │   RBAC  │ │  Audit  │ │  Core   │     │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ENTERPRISE MODULES                               │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│  │  │   HR    │ │ Payroll │ │ Finance │ │Product. │ │Supply   │     │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    COMMUNITY PLUGINS                                │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│  │  │  CRM    │ │  eComm  │ │  POS    │ │  Help   │ │ Custom  │     │   │
│  │  │         │ │         │ │         │ │  Desk   │ │ Fields  │     │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Plugin Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLUGIN FILE STRUCTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  modules/                                                                   │
│  ├── core/                              # Core framework                  │
│  │   ├── index.ts                      # Module entry                     │
│  │   ├── services/                     # Core services                    │
│  │   ├── controllers/                  # API controllers                   │
│  │   ├── entities/                     # Database entities                │
│  │   ├── migrations/                   # Schema migrations                │
│  │   ├── events/                       # Event definitions                │
│  │   ├── plugin/                       # Plugin interface                 │
│  │   └── ui/                           # Core UI components               │
│  │                                                                            │
│  ├── hr/                               # HR Module                         │
│  │   ├── index.ts                      # Module entry                      │
│  │   ├── services/                     # HR services                       │
│  │   ├── controllers/                  # API endpoints                     │
│  │   ├── entities/                     # HR entities                       │
│  │   ├── migrations/                   # HR migrations                     │
│  │   ├── events/                       # HR events                         │
│  │   ├── hooks/                        # Extension hooks                   │
│  │   ├── ui/                           # HR UI components                  │
│  │   ├── pages/                        # HR pages                          │
│  │   ├── permissions/                  # HR permissions                    │
│  │   └── locales/                      # Translations                      │
│  │                                                                            │
│  ├── payroll/                          # Payroll Module                    │
│  │   └── ... (same structure)                                          │
│  │                                                                            │
│  ├── finance/                          # Finance Module                    │
│  │   └── ... (same structure)                                          │
│  │                                                                            │
│  └── custom/                           # Custom/Third-party plugins       │
│      └── my-plugin/                     # Example custom plugin            │
│          ├── index.ts                                                     │
│          ├── package.json                                                 │
│          ├── src/                                                         │
│          │   ├── services/                                                 │
│          │   ├── entities/                                                 │
│          │   └── ui/                                                       │
│          └── tests/                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Plugin Interface

```typescript
// plugins/core/src/interfaces/plugin.interface.ts

interface ERPModule {
  // Module metadata
  name: string;
  version: string;
  description: string;
  dependencies?: string[];
  permissions?: Permission[];
  
  // Lifecycle hooks
  onInstall?(context: ModuleContext): Promise<void>;
  onUninstall?(context: ModuleContext): Promise<void>;
  onEnable?(context: ModuleContext): Promise<void>;
  onDisable?(context: ModuleContext): Promise<void>;
  onUpgrade?(fromVersion: string, toVersion: string): Promise<void>;
  
  // Database
  migrations?: Migration[];
  
  // API
  controllers?: Controller[];
  routes?: Route[];
  
  // Events
  eventHandlers?: EventHandler[];
  
  // UI
  pages?: PageDefinition[];
  components?: ComponentDefinition[];
  menuItems?: MenuItem[];
  dashboardWidgets?: WidgetDefinition[];
}

interface ModuleContext {
  db: DatabaseConnection;
  config: ConfigStore;
  logger: Logger;
  eventBus: EventBus;
  i18n: I18nService;
  permissions: PermissionService;
  ui: UIRegistry;
}
```

### 9.4 Microservices Ready Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 MICROSERVICES MIGRATION PATH                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CURRENT (Monolithic)          FUTURE (Microservices)                       │
│  ─────────────────────         ─────────────────────────                   │
│                                                                             │
│  ┌─────────────┐               ┌─────────────┐  ┌─────────────┐          │
│  │   Backend   │               │ Auth Service │  │  HR Service │          │
│  │   (Node.js) │      ──────▶  │  (Separate)  │  │  (Separate) │          │
│  └─────────────┘               └─────────────┘  └─────────────┘          │
│       │                              │                 │                  │
│       ▼                              ▼                 ▼                  │
│  ┌─────────────┐               ┌─────────────┐  ┌─────────────┐          │
│  │   Database  │               │ Postgres    │  │ Postgres    │          │
│  │  (Shared)   │               │ (Auth DB)   │  │ (HR DB)     │          │
│  └─────────────┘               └─────────────┘  └─────────────┘          │
│                                                                             │
│  MIGRATION STRATEGY:                                                       │
│  1. Start with modular monolith (clear boundaries)                        │
│  2. Extract services one by one when needed                                 │
│  3. Use message queue for inter-service communication                     │
│  4. Implement API Gateway for unified access                               │
│  5. Each service owns its data (database per service)                      │
│                                                                             │
│  COMMUNICATION PATTERNS:                                                   │
│  ┌────────────────────┐  ┌────────────────────┐                           │
│  │ Synchronous       │  │ Asynchronous       │                           │
│  │ (REST/GraphQL)     │  │ (Message Queue)    │                           │
│  │                    │  │                    │                           │
│  │ - Queries          │  │ - Events           │                           │
│  │ - Commands         │  │ - Background Jobs  │                           │
│  │ - Immediate result │  │ - Notifications    │                           │
│  └────────────────────┘  └────────────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Security Architecture

### 10.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ LAYER 1: NETWORK SECURITY                                           │   │
│  │ • TLS 1.3 (HTTPS everywhere)                                        │   │
│  │ • WAF (Web Application Firewall)                                    │   │
│  │ • DDoS Protection (CloudFlare / AWS Shield)                         │   │
│  │ • VPN for admin access                                             │   │
│  │ • Network segmentation (DMZ, App tier, DB tier)                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ LAYER 2: APPLICATION SECURITY                                       │   │
│  │ • JWT with short-lived access tokens (15 min)                      │   │
│  │ • Refresh tokens (encrypted, httpOnly cookie)                     │   │
│  │ • MFA (TOTP, SMS, Email)                                           │   │
│  │ • Rate limiting (100 req/min per user)                             │   │
│  │ • Input validation (Zod, Joi)                                      │   │
│  │ • CSRF protection                                                   │   │
│  │ • XSS prevention (Content Security Policy)                         │   │
│  │ • SQL injection prevention (parameterized queries)                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ LAYER 3: DATA SECURITY                                             │   │
│  │ • Encryption at rest (AES-256)                                      │   │
│  │ • Field-level encryption (PII, financial data)                     │   │
│  │ • Database encryption (TDE)                                         │   │
│  │ • Backup encryption                                                │   │
│  │ • Key rotation (HashiCorp Vault)                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ LAYER 4: AUDIT & COMPLIANCE                                         │   │
│  │ • Comprehensive audit logging                                      │   │
│  │ • Log aggregation (ELK Stack)                                       │   │
│  │ • SIEM integration                                                 │   │
│  │ • Compliance reports                                               │   │
│  │ • Data retention policies                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Audit Log Schema

```sql
audit_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id),
  user_email VARCHAR,
  ip_address INET,
  user_agent TEXT,
  action VARCHAR NOT NULL,        -- CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT
  resource_type VARCHAR NOT NULL, -- employee, invoice, etc.
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  changes JSONB,                  -- Computed diff
  status VARCHAR,                 -- SUCCESS, FAILED
  error_message TEXT,
  session_id UUID,
  request_id UUID,               -- For tracing
  metadata JSONB                  -- Additional context
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);
```

---

## 11. Real-Time Dashboard Architecture

### 11.1 Dashboard Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME DASHBOARD ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │   Backend   │────▶│   Redis     │────▶│   WebSocket │                   │
│  │   Services  │     │   Pub/Sub   │     │   Server    │                   │
│  └─────────────┘     └─────────────┘     └──────┬──────┘                   │
│       │                                          │                         │
│       │ Events:                                   │                         │
│       │ • payroll.processed                      │                         │
│       │ • inventory.low                          │                         │
│       │ • task.completed                         │                         │
│       │ • sales.order                            │                         │
│       │ • employee.joined                        │                         │
│       │                                          ▼                         │
│       │                                 ┌─────────────┐                   │
│       │                                 │   Browser   │                   │
│       │                                 │   Clients   │                   │
│       │                                 └──────┬──────┘                   │
│       │                                        │                         │
│       ▼                                        ▼                         │
│  ┌─────────────┐                       ┌─────────────┐                   │
│  │  Aggregator │◀──────────────────────│   React     │                   │
│  │  (Real-time)│                       │   App       │                   │
│  └─────────────┘                       └─────────────┘                   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      DASHBOARD WIDGETS                              │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │   │
│  │  │  KPI      │ │  Chart    │ │  Table    │ │  Alert    │          │   │
│  │  │  Cards    │ │  (Recharts│ │  (AG Grid)│ │  Banner   │          │   │
│  │  │  - Sales  │ │  / ChartJS│ │  - Recent │ │  - Stock  │          │   │
│  │  │  - Revenue│ │           │ │    Trans  │ │  - Tasks  │          │   │
│  │  │  - Staff  │ │           │ │           │ │  - Issues │          │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.2 Dashboard API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/kpis` | All KPI metrics |
| GET | `/api/v1/dashboard/charts/:type` | Chart data |
| GET | `/api/v1/dashboard/recent` | Recent transactions |
| GET | `/api/v1/dashboard/alerts` | Active alerts |
| WS | `/ws/dashboard` | Real-time updates |
| GET | `/api/v1/dashboard/export/:type` | Export report |

---

## 12. Summary

### Technology Summary

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript + Vite |
| UI | TailwindCSS + Radix UI |
| State | Zustand + TanStack Query |
| Backend | Node.js (NestJS) or Python (FastAPI) |
| API | REST + GraphQL |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Search | Elasticsearch |
| Queue | RabbitMQ |
| Auth | JWT + Refresh Tokens + MFA |
| Container | Docker + Kubernetes |
| CI/CD | GitHub Actions / GitLab CI |

### Key Design Principles

1. **Modularity**: Each module is independent, loosely coupled
2. **Scalability**: Horizontal scaling at all layers
3. **Security**: Defense in depth with encryption, audit logging
4. **Performance**: Optimized for low-bandwidth, offline-first PWA
5. **Extensibility**: Plugin-based architecture, microservices-ready
6. **User Experience**: Real-time dashboards, responsive UI

### Next Steps

1. Set up repository structure
2. Implement core framework (auth, RBAC, plugin system)
3. Build core modules sequentially
4. Add frontend components
5. Implement real-time features
6. Performance testing and optimization
7. Security audit and penetration testing

---

*Document Version: 1.0*  
*Last Updated: 2026-03-04*
