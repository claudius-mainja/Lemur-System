# LemurSystem ERP - Technical Documentation

## Architecture Overview

### Technology Stack

```
Frontend (Client Layer)     Backend (Server Layer)     Data Layer
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────┐
│  React + Next.js    │───▶│  Django + DRF       │───▶│ PostgreSQL  │
│  Tailwind CSS       │    │  JWT Auth            │    │ (Shared DB) │
│  React Query        │    │  Business Logic      │    │             │
│  Axios              │    │  Multi-tenancy       │    │             │
└─────────────────────┘    └─────────────────────┘    └─────────────┘
```

## Frontend (Next.js + React)

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand (local) + React Query (server state)
- **API Client**: Axios with interceptors
- **UI Components**: Custom design system

### Directory Structure
```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/        # Protected dashboard pages
│   └── page.tsx           # Landing page
├── components/
│   ├── design-system/     # Reusable UI components
│   └── ui/                # Additional UI components
├── services/
│   └── api.ts             # API client with all endpoints
├── stores/
│   ├── auth.store.ts       # Authentication state
│   └── data.store.ts      # Local data state
└── lib/                   # Utilities and helpers
```

### Design System Components
Located in `src/components/design-system/`:
- `Button` - Primary, secondary, outline, ghost, danger variants
- `Card` - Elevated cards with header, content, footer
- `Badge` - Status badges with variants
- `Input` - Form inputs with validation
- `Table` - Data tables with sorting/pagination
- `Modal` - Dialogs and confirmations

### React Query Usage
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Data fetching
const { data, isLoading } = useQuery({
  queryKey: ['employees'],
  queryFn: () => employeesApi.getAll(),
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: (data) => employeesApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['employees'] });
  },
});
```

## Backend (Django)

### Tech Stack
- **Framework**: Django 5.x
- **API**: Django REST Framework
- **Auth**: JWT (djangorestframework-simplejwt)
- **Rate Limiting**: django-axes
- **Multi-tenancy**: Organization-based filtering

### Directory Structure
```
backend/
├── core/                   # Core models and views
│   ├── models.py          # User, Organization, AuditLog
│   ├── views.py          # Auth, organization endpoints
│   └── serializers.py    # User/Org serializers
├── hr/                    # Human Resources module
├── finance/               # Finance module
├── crm/                   # CRM module
├── payroll/              # Payroll module
├── supply_chain/         # Supply Chain module
├── automation/           # Automation module
└── marketing/            # Marketing module
```

### Multi-Tenancy Strategy

**Single Database, Shared Schema with organization_id**

Every model includes an `organization` foreign key:

```python
class Employee(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, ...)
    organization = models.ForeignKey('core.Organization', ...)
    department = models.ForeignKey('hr.Department', ...)
    # ... other fields
```

**View Filtering Pattern**:
```python
def get_queryset(self):
    org = getattr(self.request.user, 'organization', None)
    if org:
        return Employee.objects.filter(organization=org)
    return Employee.objects.none()
```

### API Endpoints Pattern
```
/api/v1/auth/           # Authentication
/api/v1/hr/             # HR endpoints
/api/v1/finance/         # Finance endpoints
/api/v1/crm/             # CRM endpoints
/api/v1/core/            # Core/User management
```

## Multi-Tenancy Implementation

### Organization Model
```python
class Organization(models.Model):
    name = models.CharField(max_length=200)
    industry = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    currency = models.CharField(max_length=10, default='USD')
    plan = models.CharField(max_length=20, default='starter')
    max_users = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
```

### User-Organization Relationship
```python
class User(AbstractUser):
    organization = models.ForeignKey(
        'core.Organization',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
```

### User Limit Enforcement
- Starter: 5 users
- Professional: 25 users
- Enterprise: 100 users
- Extra users: $5/month each

## UI/UX Guidelines

### Design Principles
1. **Clean & Minimal**: White space, clear hierarchy
2. **Premium Feel**: Subtle shadows, smooth animations
3. **Data-Focused**: Dashboards, charts, tables
4. **Consistent**: Design system components

### Color Palette
```css
--primary: #0891b2;      /* Cyan */
--secondary: #8b5cf6;    /* Violet */
--accent: #f59e0b;       /* Amber */
--success: #22c55e;     /* Green */
--danger: #ef4444;       /* Red */
--warning: #eab308;      /* Yellow */
```

### Component Usage
```typescript
import { Button, Card, Badge, Table, Modal } from '@/components/design-system';

// Example: Employee List
<Card>
  <CardHeader action={<Button>Add Employee</Button>}>
    Employees
  </CardHeader>
  <Table
    columns={columns}
    data={employees}
    onRowClick={handleEdit}
  />
</Card>
```

## Common Tasks

### Adding a New API Endpoint

1. **Backend**: Add to views.py
```python
@action(detail=True, methods=['post'])
def custom_action(self, request, pk=None):
    # Your logic here
    return Response(data)
```

2. **Frontend**: Add to services/api.ts
```typescript
export const moduleApi = {
  customAction: (id: string) => api.post(`/module/${id}/custom_action/`),
};
```

3. **Frontend**: Use with React Query
```typescript
const mutation = useMutation({
  mutationFn: (id) => moduleApi.customAction(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['module'] });
  },
});
```

### Adding a New Model (Backend)

1. Create model in app/models.py
2. Add ForeignKey to Organization
3. Create serializer in app/serializers.py
4. Add viewset in app/views.py
5. Register in app/urls.py
6. Run migrations

### Using the Design System

```typescript
import { Button, Card, Input, Badge, Table, Modal } from '@/components/design-system';

// Form Example
<Card>
  <Input label="Name" placeholder="Enter name" />
  <Input label="Email" type="email" error="Invalid email" />
  <Button variant="primary">Submit</Button>
</Card>
```

## Environment Variables

### Backend (.env)
```
DB_NAME=lemursystem
DB_USER=postgres
DB_PASSWORD=1923
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Running the Application

```bash
# Start Backend
cd backend
python manage.py runserver 8000

# Start Frontend
cd frontend
npm run dev
```

## Code Quality

- No console.log statements
- Proper TypeScript types
- Consistent naming conventions
- Error handling with try/catch
- Loading states for async operations
