from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    HR = "hr"
    FINANCE = "finance"
    ACCOUNTANT = "accountant"
    MANAGER = "manager"
    EMPLOYEE = "employee"
    ORDINARY = "ordinary"

class SubscriptionPlan(str, enum.Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class Industry(str, enum.Enum):
    TECHNOLOGY = "technology"
    RETAIL = "retail"
    MANUFACTURING = "manufacturing"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    FINANCE = "finance"
    CONSTRUCTION = "construction"
    HOSPITALITY = "hospitality"
    TRANSPORTATION = "transportation"
    AGRICULTURE = "agriculture"
    MINING = "mining"
    TELECOMMUNICATIONS = "telecommunications"
    REALESTATE = "realestate"
    LEGAL = "legal"
    CONSULTING = "consulting"
    OTHER = "other"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.EMPLOYEE)
    department = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    organization_id = Column(String, nullable=False, index=True)
    organization_name = Column(String, nullable=False)
    industry = Column(SQLEnum(Industry), default=Industry.OTHER)
    subscription = Column(SQLEnum(SubscriptionPlan), default=SubscriptionPlan.STARTER)
    currency = Column(String, default="ZAR")
    country = Column(String, default="ZA")
    is_active = Column(Boolean, default=True)
    is_on_trial = Column(Boolean, default=False)
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    organization_id = Column(String, nullable=False, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True)
    position = Column(String, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=True)
    salary = Column(Float, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    manager_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    company = Column(String, nullable=True)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, default="ZA")
    service_type = Column(String, nullable=True)
    type = Column(String, default="customer")
    status = Column(String, default="active")
    source = Column(String, default="manual")
    total_spent = Column(Float, default=0)
    last_contact = Column(DateTime(timezone=True), nullable=True)
    assigned_to = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    type = Column(String, default="product")
    unit_price = Column(Float, default=0)
    quantity = Column(Integer, default=0)
    min_quantity = Column(Integer, default=0)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    invoice_number = Column(String, unique=True, nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    customer_address = Column(String, nullable=True)
    subtotal = Column(Float, default=0)
    tax_rate = Column(Float, default=15)
    tax_amount = Column(Float, default=0)
    discount = Column(Float, default=0)
    total = Column(Float, default=0)
    amount_paid = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    status = Column(String, default="draft")
    due_date = Column(DateTime(timezone=True), nullable=True)
    issue_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(String, primary_key=True, index=True)
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False)
    product_id = Column(String, nullable=True)
    product_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Float, default=1)
    unit_price = Column(Float, default=0)
    tax_rate = Column(Float, default=0)
    total = Column(Float, default=0)

class Quotation(Base):
    __tablename__ = "quotations"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    quotation_number = Column(String, unique=True, nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    subtotal = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    status = Column(String, default="draft")
    valid_until = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class QuotationItem(Base):
    __tablename__ = "quotation_items"
    
    id = Column(String, primary_key=True, index=True)
    quotation_id = Column(String, ForeignKey("quotations.id"), nullable=False)
    product_id = Column(String, nullable=True)
    product_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Float, default=1)
    unit_price = Column(Float, default=0)
    total = Column(Float, default=0)

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=True)
    amount = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    payment_method = Column(String, default="bank_transfer")
    reference = Column(String, nullable=True)
    status = Column(String, default="completed")
    payment_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    amount = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    date = Column(DateTime(timezone=True), nullable=True)
    vendor = Column(String, nullable=True)
    receipt = Column(String, nullable=True)
    status = Column(String, default="pending")
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)
    category = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    amount = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    date = Column(DateTime(timezone=True), nullable=True)
    reference = Column(String, nullable=True)
    status = Column(String, default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    status = Column(String, default="new")
    source = Column(String, default="website")
    value = Column(Float, default=0)
    assigned_to = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True)
    value = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    stage = Column(String, default="prospecting")
    probability = Column(Integer, default=10)
    expected_close = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    assigned_to = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True)
    lead_id = Column(String, ForeignKey("leads.id"), nullable=True)
    deal_id = Column(String, ForeignKey("deals.id"), nullable=True)
    assigned_to = Column(String, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    position = Column(String, nullable=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Inventory(Base):
    __tablename__ = "inventory"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, nullable=True)
    category = Column(String, nullable=True)
    quantity = Column(Integer, default=0)
    min_quantity = Column(Integer, default=0)
    unit_price = Column(Float, default=0)
    total_value = Column(Float, default=0)
    status = Column(String, default="in_stock")
    supplier = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, default="ZA")
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Payroll(Base):
    __tablename__ = "payroll"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    employee_name = Column(String, nullable=False)
    basic_salary = Column(Float, default=0)
    allowances = Column(Float, default=0)
    overtime = Column(Float, default=0)
    bonuses = Column(Float, default=0)
    gross_salary = Column(Float, default=0)
    tax_deduction = Column(Float, default=0)
    pension_deduction = Column(Float, default=0)
    other_deductions = Column(Float, default=0)
    total_deductions = Column(Float, default=0)
    net_salary = Column(Float, default=0)
    pay_period = Column(String, nullable=False)
    pay_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Payslip(Base):
    __tablename__ = "payslips"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    payroll_id = Column(String, ForeignKey("payroll.id"), nullable=True)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    employee_name = Column(String, nullable=False)
    employee_email = Column(String, nullable=True)
    pay_period = Column(String, nullable=False)
    pay_date = Column(DateTime(timezone=True), nullable=True)
    basic_salary = Column(Float, default=0)
    allowances = Column(Float, default=0)
    overtime = Column(Float, default=0)
    bonuses = Column(Float, default=0)
    gross_salary = Column(Float, default=0)
    tax_deduction = Column(Float, default=0)
    pension_deduction = Column(Float, default=0)
    other_deductions = Column(Float, default=0)
    total_deductions = Column(Float, default=0)
    net_salary = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    status = Column(String, default="generated")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    employee_name = Column(String, nullable=False)
    leave_type = Column(String, nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    days = Column(Integer, default=1)
    reason = Column(Text, nullable=True)
    status = Column(String, default="pending")
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    meeting_type = Column(String, default="online")
    location = Column(String, nullable=True)
    meeting_link = Column(String, nullable=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    organizer_id = Column(String, nullable=True)
    attendee_ids = Column(Text, nullable=True)
    attendee_emails = Column(Text, nullable=True)
    reminder = Column(Integer, default=15)
    status = Column(String, default="scheduled")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String, default="event")
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    all_day = Column(Boolean, default=False)
    location = Column(String, nullable=True)
    reminder = Column(Integer, default=15)
    color = Column(String, default="#7e49de")
    created_by = Column(String, nullable=True)
    attendees = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(String, nullable=True)
    assigned_to = Column(String, nullable=True)
    priority = Column(String, default="medium")
    status = Column(String, default="todo")
    due_date = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="planning")
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    budget = Column(Float, default=0)
    currency = Column(String, default="ZAR")
    owner_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CurrencyRate(Base):
    __tablename__ = "currency_rates"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    base_currency = Column(String, nullable=False)
    target_currency = Column(String, nullable=False)
    rate = Column(Float, default=1)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
