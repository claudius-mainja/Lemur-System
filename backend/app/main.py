from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, employees, customers, invoices, products, payroll, supply_chain, crm
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

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["Human Resources"])
app.include_router(customers.router, prefix="/api/v1/customers", tags=["Customers"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["Finance - Invoices"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Finance - Products"])
app.include_router(payroll.router, prefix="/api/v1/payroll", tags=["Payroll"])
app.include_router(supply_chain.router, prefix="/api/v1/inventory", tags=["Supply Chain"])
app.include_router(crm.router, prefix="/api/v1/leads", tags=["CRM"])

@app.get("/")
async def root():
    return {"message": "LemurSystem API", "version": "1.0.0", "status": "running"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "lemursystem-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
