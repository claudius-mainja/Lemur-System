from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, employees, customers, invoices, products, payroll, supply_chain, crm, users, tenants
from app.core.config import settings

app = FastAPI(
    title="LemurSystem API",
    description="Enterprise ERP API for SADC businesses",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

# Users routes
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

# Tenants routes
app.include_router(tenants.router, prefix="/api/v1/tenants", tags=["Tenants"])

# HR Module routes
app.include_router(employees.router, prefix="/api/v1/hr", tags=["Human Resources"])

# Finance Module routes  
app.include_router(invoices.router, prefix="/api/v1/finance", tags=["Finance - Invoices"])
app.include_router(customers.router, prefix="/api/v1/crm", tags=["CRM"])

# Products routes (Finance Inventory)
app.include_router(products.router, prefix="/api/v1/inventory", tags=["Inventory"])

# Supply Chain routes
app.include_router(supply_chain.router, prefix="/api/v1/supply-chain", tags=["Supply Chain"])

# CRM routes
app.include_router(crm.router, prefix="/api/v1/crm", tags=["CRM"])

# Payroll routes
app.include_router(payroll.router, prefix="/api/v1/payroll", tags=["Payroll"])

@app.get("/")
async def root():
    return {"message": "LemurSystem API", "version": "1.0.0", "status": "running"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "lemursystem-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
