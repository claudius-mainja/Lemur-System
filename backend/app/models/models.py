from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    HR = "hr"
    FINANCE = "finance"
    MARKETING = "marketing"
    MANAGER = "manager"
    EMPLOYEE = "employee"

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
    subtotal = Column(Float, default=0)
    tax = Column(Float, default=0)
    total = Column(Float, default=0)
    status = Column(String, default="draft")
    due_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)
    items = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class InvoiceItem(Base):
    __tablename__ = "invoice_items"
    
    id = Column(String, primary_key=True, index=True)
    invoice_id = Column(String, ForeignKey("invoices.id"), nullable=False)
    product_id = Column(String, nullable=True)
    product_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, default=0)
    total = Column(Float, default=0)

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

class Payroll(Base):
    __tablename__ = "payroll"
    
    id = Column(String, primary_key=True, index=True)
    organization_id = Column(String, nullable=False, index=True)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=True)
    employee_name = Column(String, nullable=False)
    basic_salary = Column(Float, default=0)
    deductions = Column(Float, default=0)
    bonuses = Column(Float, default=0)
    net_salary = Column(Float, default=0)
    pay_date = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

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
