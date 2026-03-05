# LemurSystem - All-in-One ERP for Small Business

## Overview

LemurSystem is a comprehensive, web-based ERP (Enterprise Resource Planning) solution designed specifically for small to medium enterprises. It provides integrated modules for managing all aspects of your business operations.

## Features

### Core Modules

1. **Human Resources**
   - Employee management and directory
   - Leave tracking and approval workflows
   - Recruitment and applicant tracking
   - Training and development

2. **Payroll Management**
   - Automated salary processing
   - Tax calculations and deductions
   - Direct deposit support
   - Payslip generation

3. **Financial Services**
   - General ledger and journal entries
   - Accounts payable and receivable
   - Fixed assets management
   - Financial reporting (P&L, Balance Sheet)

4. **Supply Chain**
   - Inventory management
   - Purchase orders
   - Vendor management
   - Stock alerts

5. **Productivity Tools**
   - Document management
   - Task and project management
   - Team calendar
   - Real-time chat

6. **Services Management**
   - Help desk tickets
   - SLA tracking
   - Knowledge base

### Key Features

- **Multi-tenant SaaS**: Each organization gets their own isolated environment
- **Secure**: Bank-level encryption, GDPR compliant
- **Fast**: Optimized for low-bandwidth networks
- **Accessible**: Works on any device, online or offline (PWA)
- **Scalable**: Grows with your business

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Installation

```bash
# Clone the repository
cd erp-app

# Copy environment file
cp backend/.env.example backend/.env

# Start with Docker
cd docker
docker-compose up -d
```

### Access

- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:3001/docs
- **Database**: localhost:5432 (erpuser/erppassword)
- **Redis**: localhost:6379

### Default Login

- **Email**: admin@erp.com
- **Password**: Admin@123

## Development

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| UI | TailwindCSS, Radix UI |
| State | Zustand, TanStack Query |
| Backend | NestJS, Node.js |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Queue | RabbitMQ |
| Search | Elasticsearch |

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/refresh` - Refresh token

### Tenants
- `POST /api/v1/tenants/register` - Register organization (for SaaS)

### HR
- `GET /api/v1/hr/employees` - List employees
- `POST /api/v1/hr/employees` - Create employee
- `GET /api/v1/hr/departments` - List departments

## License

AGPLv3 for open source use. Commercial license available.

## Support

For support, please contact support@lemursystem.com
