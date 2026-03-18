from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    organization_name: str
    industry: str
    country: str
    currency: str
    plan: str = "starter"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    department: Optional[str] = None
    organization_id: str
    organization_name: str
    industry: str
    subscription: str
    currency: str
    country: str
    is_active: bool
    is_on_trial: bool

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

# Employee Schemas
class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    salary: Optional[float] = None

class EmployeeResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[datetime] = None
    salary: Optional[float] = None
    status: str
    created_at: datetime

# Customer Schemas
class CustomerCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = "ZA"
    service_type: Optional[str] = None

class CustomerResponse(BaseModel):
    id: str
    name: str
    company: Optional[str] = None
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: str
    service_type: Optional[str] = None
    type: str
    status: str
    source: str
    total_spent: float
    created_at: datetime

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    type: str = "product"
    unit_price: float = 0
    quantity: int = 0
    min_quantity: int = 0

class ProductResponse(BaseModel):
    id: str
    name: str
    sku: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    type: str
    unit_price: float
    quantity: int
    min_quantity: int
    status: str
    created_at: datetime

# Invoice Schemas
class InvoiceItemCreate(BaseModel):
    product_id: Optional[str] = None
    product_name: str
    description: Optional[str] = None
    quantity: int = 1
    unit_price: float

class InvoiceCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: Optional[str] = None
    items: List[InvoiceItemCreate]
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: Optional[str] = None
    subtotal: float
    tax: float
    total: float
    status: str
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

# Lead Schemas
class LeadCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = "website"
    value: Optional[float] = 0
    notes: Optional[str] = None

class LeadResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    status: str
    source: str
    value: float
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

# Inventory Schemas
class InventoryCreate(BaseModel):
    name: str
    sku: Optional[str] = None
    category: Optional[str] = None
    quantity: int = 0
    min_quantity: int = 0
    unit_price: float = 0
    supplier: Optional[str] = None

class InventoryResponse(BaseModel):
    id: str
    name: str
    sku: Optional[str] = None
    category: Optional[str] = None
    quantity: int
    min_quantity: int
    unit_price: float
    total_value: float
    status: str
    supplier: Optional[str] = None
    created_at: datetime

# Payroll Schemas
class PayrollCreate(BaseModel):
    employee_id: str
    employee_name: str
    basic_salary: float
    deductions: float = 0
    bonuses: float = 0
    pay_date: Optional[datetime] = None

class PayrollResponse(BaseModel):
    id: str
    employee_id: Optional[str] = None
    employee_name: str
    basic_salary: float
    deductions: float
    bonuses: float
    net_salary: float
    pay_date: Optional[datetime] = None
    status: str
    created_at: datetime

# Leave Request Schemas
class LeaveRequestCreate(BaseModel):
    employee_id: str
    employee_name: str
    leave_type: str
    start_date: datetime
    end_date: datetime
    days: int = 1
    reason: Optional[str] = None

class LeaveRequestResponse(BaseModel):
    id: str
    employee_id: Optional[str] = None
    employee_name: str
    leave_type: str
    start_date: datetime
    end_date: datetime
    days: int
    reason: Optional[str] = None
    status: str
    created_at: datetime

# Generic Response
class MessageResponse(BaseModel):
    message: str
    success: bool = True
