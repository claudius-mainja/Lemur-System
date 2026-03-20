from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, employees, customers, invoices, products, payroll, supply_chain, crm, users, tenants, productivity
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.database import engine, Base, SessionLocal
from app.models.models import User, Employee, Department, Customer, Product, Invoice, InvoiceItem, Quotation, QuotationItem, Payment, Expense, Transaction, Lead, Deal, Activity, Contact, Inventory, Vendor, Payroll, Payslip, LeaveRequest, Meeting, CalendarEvent, Task, Project, CurrencyRate
import uuid

app = FastAPI(
    title="LemurSystem API",
    description="Enterprise ERP API for SADC businesses",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.on_event("startup")
async def startup_event():
    from app.models.models import User, Employee, Department, Customer, Product, Invoice, InvoiceItem, Quotation, QuotationItem, Payment, Expense, Transaction, Lead, Deal, Activity, Contact, Inventory, Vendor, Payroll, Payslip, LeaveRequest, Meeting, CalendarEvent, Task, Project, CurrencyRate
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == "admin@lemursystem.com").first()
        if not existing_user:
            default_tenants = [
                {
                    "email": "admin@lemursystem.com",
                    "password": "LemurAdmin2024!",
                    "first_name": "Super",
                    "last_name": "Admin",
                    "organization_name": "LemurSystem HQ",
                    "role": "super_admin",
                    "industry": "technology",
                    "subscription": "enterprise",
                    "currency": "USD",
                    "country": "ZA",
                },
                {
                    "email": "demo@lemursystem.com",
                    "password": "DemoUser123!",
                    "first_name": "Demo",
                    "last_name": "User",
                    "organization_name": "Demo Organization",
                    "role": "admin",
                    "industry": "consulting",
                    "subscription": "starter",
                    "currency": "USD",
                    "country": "ZA",
                },
                {
                    "email": "finance@lemursystem.com",
                    "password": "FinanceUser123!",
                    "first_name": "Finance",
                    "last_name": "Manager",
                    "organization_name": "Finance Corp",
                    "role": "admin",
                    "industry": "finance",
                    "subscription": "professional",
                    "currency": "USD",
                    "country": "ZA",
                },
            ]
            
            for tenant_data in default_tenants:
                user = User(
                    id=str(uuid.uuid4()),
                    email=tenant_data["email"],
                    password_hash=get_password_hash(tenant_data["password"]),
                    first_name=tenant_data["first_name"],
                    last_name=tenant_data["last_name"],
                    role=tenant_data["role"],
                    organization_id=str(uuid.uuid4()),
                    organization_name=tenant_data["organization_name"],
                    industry=tenant_data["industry"],
                    subscription=tenant_data["subscription"],
                    currency=tenant_data["currency"],
                    country=tenant_data["country"],
                    is_active=True,
                    is_on_trial=True
                )
                db.add(user)
            
            db.commit()
            print("Default tenant accounts created successfully!")
    except Exception as e:
        print(f"Error creating default tenants: {e}")
        db.rollback()
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(tenants.router, prefix="/api/v1/tenants", tags=["Tenants"])
app.include_router(employees.router, prefix="/api/v1/hr", tags=["Human Resources"])
app.include_router(invoices.router, prefix="/api/v1/finance", tags=["Finance - Invoices"])
app.include_router(customers.router, prefix="/api/v1/crm", tags=["CRM"])
app.include_router(products.router, prefix="/api/v1/inventory", tags=["Inventory"])
app.include_router(supply_chain.router, prefix="/api/v1/supply-chain", tags=["Supply Chain"])
app.include_router(crm.router, prefix="/api/v1/crm", tags=["CRM"])
app.include_router(payroll.router, prefix="/api/v1/payroll", tags=["Payroll"])
app.include_router(productivity.router, prefix="/api/v1/productivity", tags=["Productivity"])

@app.get("/")
async def root():
    return {"message": "LemurSystem API", "version": "1.0.0", "status": "running"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "lemursystem-api"}

@app.get("/api/v1/dev/credentials")
async def get_dev_credentials():
    from app.db.database import SessionLocal
    from app.models.models import User
    
    db = SessionLocal()
    try:
        users = db.query(User).all()
        credentials = []
        for user in users:
            credentials.append({
                "email": user.email,
                "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
                "organization": user.organization_name,
                "plan": user.subscription.value if hasattr(user.subscription, 'value') else str(user.subscription),
            })
        return {
            "message": "Default credentials (change these in production!)",
            "users": credentials
        }
    finally:
        db.close()

@app.get("/api/v1/time")
async def get_server_time():
    from datetime import datetime, timezone
    return {
        "server_time": datetime.now(timezone.utc).isoformat(),
        "timestamp": datetime.now(timezone.utc).timestamp()
    }

@app.get("/api/v1/currencies")
async def get_supported_currencies():
    return {
        "currencies": [
            {"code": "ZAR", "name": "South African Rand", "symbol": "R", "country": "South Africa"},
            {"code": "BWP", "name": "Botswana Pula", "symbol": "P", "country": "Botswana"},
            {"code": "NAD", "name": "Namibian Dollar", "symbol": "$", "country": "Namibia"},
            {"code": "SZL", "name": "Eswatini Lilangeni", "symbol": "E", "country": "Eswatini"},
            {"code": "LSL", "name": "Lesotho Loti", "symbol": "L", "country": "Lesotho"},
            {"code": "ZMW", "name": "Zambian Kwacha", "symbol": "ZK", "country": "Zambia"},
            {"code": "ZWL", "name": "Zimbabwean Dollar", "symbol": "$", "country": "Zimbabwe"},
            {"code": "MWK", "name": "Malawian Kwacha", "symbol": "MK", "country": "Malawi"},
            {"code": "MZN", "name": "Mozambican Metical", "symbol": "MT", "country": "Mozambique"},
            {"code": "AOA", "name": "Angolan Kwanza", "symbol": "Kz", "country": "Angola"},
            {"code": "USD", "name": "US Dollar", "symbol": "$", "country": "United States"},
            {"code": "EUR", "name": "Euro", "symbol": "€", "country": "European Union"},
            {"code": "GBP", "name": "British Pound", "symbol": "£", "country": "United Kingdom"},
        ]
    }

@app.post("/api/v1/currency/convert")
async def convert_currency(amount: float, from_currency: str, to_currency: str):
    from datetime import datetime, timezone
    
    # Default exchange rates (relative to ZAR)
    rates_to_zar = {
        "ZAR": 1.0,
        "BWP": 0.137,
        "NAD": 1.0,
        "SZL": 1.0,
        "LSL": 1.0,
        "ZMW": 0.38,
        "ZWL": 0.0028,
        "MWK": 0.00059,
        "MZN": 0.016,
        "AOA": 0.0012,
        "USD": 0.055,
        "EUR": 0.050,
        "GBP": 0.043,
    }
    
    rate = rates_to_zar.get(to_currency, 1.0)
    converted = amount * rate
    
    symbols = {
        "ZAR": "R", "BWP": "P", "NAD": "$", "SZL": "E", 
        "LSL": "L", "ZMW": "ZK", "ZWL": "$", "MWK": "MK",
        "MZN": "MT", "AOA": "Kz", "USD": "$", "EUR": "€", "GBP": "£"
    }
    
    return {
        "amount": amount,
        "from_currency": from_currency,
        "to_currency": to_currency,
        "rate": rate,
        "converted_amount": round(converted, 2),
        "currency_symbol": symbols.get(to_currency, to_currency),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
