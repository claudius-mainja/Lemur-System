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
    phone: Optional[str] = None
    organization_id: str
    organization_name: str
    industry: str
    subscription: str
    currency: str
    country: str
    is_active: bool
    is_on_trial: bool
    created_at: Optional[datetime] = None
    server_time: Optional[datetime] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
    server_time: datetime = datetime.utcnow()

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

# Department Schemas
class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
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
    quantity: float = 1
    unit_price: float
    tax_rate: float = 0

class InvoiceCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: Optional[str] = None
    customer_address: Optional[str] = None
    items: List[InvoiceItemCreate]
    tax_rate: float = 15
    discount: float = 0
    due_date: Optional[datetime] = None
    notes: Optional[str] = None

class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: Optional[str] = None
    customer_address: Optional[str] = None
    subtotal: float
    tax_rate: float
    tax_amount: float
    discount: float
    total: float
    amount_paid: float
    currency: str
    status: str
    due_date: Optional[datetime] = None
    issue_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

# Quotation Schemas
class QuotationItemCreate(BaseModel):
    product_id: Optional[str] = None
    product_name: str
    description: Optional[str] = None
    quantity: float = 1
    unit_price: float

class QuotationCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: Optional[str] = None
    items: List[QuotationItemCreate]
    valid_until: Optional[datetime] = None
    notes: Optional[str] = None

class QuotationResponse(BaseModel):
    id: str
    quotation_number: str
    customer_id: Optional[str] = None
    customer_name: str
    customer_email: Optional[str] = None
    subtotal: float
    tax_amount: float
    total: float
    currency: str
    status: str
    valid_until: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime

# Payment Schemas
class PaymentCreate(BaseModel):
    invoice_id: Optional[str] = None
    amount: float
    payment_method: str = "bank_transfer"
    reference: Optional[str] = None

class PaymentResponse(BaseModel):
    id: str
    invoice_id: Optional[str] = None
    amount: float
    currency: str
    payment_method: str
    reference: Optional[str] = None
    status: str
    payment_date: Optional[datetime] = None
    created_at: datetime

# Expense Schemas
class ExpenseCreate(BaseModel):
    category: str
    description: Optional[str] = None
    amount: float
    currency: str = "ZAR"
    date: Optional[datetime] = None
    vendor: Optional[str] = None
    receipt: Optional[str] = None

class ExpenseResponse(BaseModel):
    id: str
    category: str
    description: Optional[str] = None
    amount: float
    currency: str
    date: Optional[datetime] = None
    vendor: Optional[str] = None
    status: str
    created_by: Optional[str] = None
    created_at: datetime

# Transaction Schemas
class TransactionCreate(BaseModel):
    type: str
    category: Optional[str] = None
    description: Optional[str] = None
    amount: float
    currency: str = "ZAR"
    date: Optional[datetime] = None
    reference: Optional[str] = None

class TransactionResponse(BaseModel):
    id: str
    type: str
    category: Optional[str] = None
    description: Optional[str] = None
    amount: float
    currency: str
    date: Optional[datetime] = None
    reference: Optional[str] = None
    status: str
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

# Deal Schemas
class DealCreate(BaseModel):
    title: str
    customer_id: Optional[str] = None
    value: float = 0
    stage: str = "prospecting"
    probability: int = 10
    expected_close: Optional[datetime] = None
    notes: Optional[str] = None

class DealResponse(BaseModel):
    id: str
    title: str
    customer_id: Optional[str] = None
    value: float
    currency: str
    stage: str
    probability: int
    expected_close: Optional[datetime] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

# Activity Schemas
class ActivityCreate(BaseModel):
    type: str
    title: str
    description: Optional[str] = None
    customer_id: Optional[str] = None
    lead_id: Optional[str] = None
    deal_id: Optional[str] = None
    due_date: Optional[datetime] = None

class ActivityResponse(BaseModel):
    id: str
    type: str
    title: str
    description: Optional[str] = None
    customer_id: Optional[str] = None
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime

# Contact Schemas
class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    customer_id: Optional[str] = None

class ContactResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
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

# Vendor Schemas
class VendorCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = "ZA"

class VendorResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: str
    status: str
    created_at: datetime

# Payroll Schemas
class PayrollCreate(BaseModel):
    employee_id: str
    employee_name: str
    basic_salary: float
    allowances: float = 0
    overtime: float = 0
    bonuses: float = 0
    pay_period: str
    pay_date: Optional[datetime] = None

class PayrollResponse(BaseModel):
    id: str
    employee_id: Optional[str] = None
    employee_name: str
    basic_salary: float
    allowances: float
    overtime: float
    bonuses: float
    gross_salary: float
    tax_deduction: float
    pension_deduction: float
    other_deductions: float
    total_deductions: float
    net_salary: float
    pay_period: str
    pay_date: Optional[datetime] = None
    status: str
    created_at: datetime

# Payslip Schemas
class PayslipResponse(BaseModel):
    id: str
    payroll_id: Optional[str] = None
    employee_id: Optional[str] = None
    employee_name: str
    employee_email: Optional[str] = None
    pay_period: str
    pay_date: Optional[datetime] = None
    basic_salary: float
    allowances: float
    overtime: float
    bonuses: float
    gross_salary: float
    tax_deduction: float
    pension_deduction: float
    other_deductions: float
    total_deductions: float
    net_salary: float
    currency: str
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
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime

# Meeting Schemas
class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    meeting_type: str = "online"
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    start_time: datetime
    end_time: datetime
    attendee_ids: Optional[str] = None
    attendee_emails: Optional[str] = None
    reminder: int = 15

class MeetingResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    meeting_type: str
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    start_time: datetime
    end_time: datetime
    organizer_id: Optional[str] = None
    attendee_ids: Optional[str] = None
    attendee_emails: Optional[str] = None
    reminder: int
    status: str
    created_at: datetime

# Calendar Event Schemas
class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "event"
    start_date: datetime
    end_date: datetime
    all_day: bool = False
    location: Optional[str] = None
    reminder: int = 15
    color: str = "#7e49de"
    attendees: Optional[str] = None

class CalendarEventResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    event_type: str
    start_date: datetime
    end_date: datetime
    all_day: bool
    location: Optional[str] = None
    reminder: int
    color: str
    created_by: Optional[str] = None
    attendees: Optional[str] = None
    created_at: datetime

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    project_id: Optional[str] = None
    assigned_to: Optional[str] = None
    priority: str
    status: str
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: float = 0

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: float
    currency: str
    owner_id: Optional[str] = None
    created_at: datetime

# Currency Rate Schemas
class CurrencyRateCreate(BaseModel):
    base_currency: str
    target_currency: str
    rate: float

class CurrencyRateResponse(BaseModel):
    id: str
    base_currency: str
    target_currency: str
    rate: float
    updated_at: Optional[datetime] = None

class CurrencyConvertRequest(BaseModel):
    amount: float
    from_currency: str
    to_currency: str

class CurrencyConvertResponse(BaseModel):
    amount: float
    from_currency: str
    to_currency: str
    rate: float
    converted_amount: float
    currency_symbol: str

# Dashboard Stats Schemas
class DashboardStats(BaseModel):
    total_revenue: float
    total_expenses: float
    net_profit: float
    active_employees: int
    pending_leaves: int
    total_invoices: int
    paid_invoices: int
    pending_invoices: int
    overdue_invoices: int
    total_customers: int
    total_leads: int
    deals_won: int
    deals_lost: int

# Generic Response
class MessageResponse(BaseModel):
    message: str
    success: bool = True
