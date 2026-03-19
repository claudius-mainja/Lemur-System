from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import uuid

from app.db.database import get_db
from app.models.models import User, Employee, Payroll, Payslip
from app.schemas.schemas import (
    PayrollCreate, PayrollResponse, PayslipResponse, MessageResponse
)
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

TAX_RATES = {
    "ZA": 0.18,
    "BW": 0.25,
    "NA": 0.32,
    "SZ": 0.33,
    "LS": 0.30,
    "ZM": 0.30,
    "ZW": 0.25,
    "MW": 0.30,
    "MZ": 0.32,
    "AO": 0.25,
}

PENSION_RATE = 0.05

def calculate_tax(gross_salary: float, country: str = "ZA") -> float:
    tax_rate = TAX_RATES.get(country, 0.25)
    if gross_salary <= 0:
        return 0
    tax_free_threshold = 10000
    if gross_salary <= tax_free_threshold:
        return 0
    taxable_amount = gross_salary - tax_free_threshold
    return taxable_amount * tax_rate

@router.get("/payroll", response_model=List[PayrollResponse])
def get_payroll_records(
    employee_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payroll).filter(Payroll.organization_id == current_user.organization_id)
    
    if employee_id:
        query = query.filter(Payroll.employee_id == employee_id)
    if status:
        query = query.filter(Payroll.status == status)
    
    records = query.order_by(Payroll.created_at.desc()).all()
    return records

@router.post("/payroll", response_model=PayrollResponse)
def create_payroll(
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gross_salary = (payroll_data.basic_salary + 
                    payroll_data.allowances + 
                    payroll_data.overtime + 
                    payroll_data.bonuses)
    
    tax_deduction = calculate_tax(gross_salary, current_user.country)
    pension_deduction = gross_salary * PENSION_RATE
    total_deductions = tax_deduction + pension_deduction
    net_salary = gross_salary - total_deductions
    
    payroll = Payroll(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        employee_id=payroll_data.employee_id,
        employee_name=payroll_data.employee_name,
        basic_salary=payroll_data.basic_salary,
        allowances=payroll_data.allowances,
        overtime=payroll_data.overtime,
        bonuses=payroll_data.bonuses,
        gross_salary=gross_salary,
        tax_deduction=tax_deduction,
        pension_deduction=pension_deduction,
        other_deductions=0,
        total_deductions=total_deductions,
        net_salary=net_salary,
        pay_period=payroll_data.pay_period,
        pay_date=payroll_data.pay_date or datetime.now(timezone.utc),
        status="processed"
    )
    
    db.add(payroll)
    
    payslip = Payslip(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        payroll_id=payroll.id,
        employee_id=payroll_data.employee_id,
        employee_name=payroll_data.employee_name,
        pay_period=payroll_data.pay_period,
        pay_date=payroll_data.pay_date or datetime.now(timezone.utc),
        basic_salary=payroll_data.basic_salary,
        allowances=payroll_data.allowances,
        overtime=payroll_data.overtime,
        bonuses=payroll_data.bonuses,
        gross_salary=gross_salary,
        tax_deduction=tax_deduction,
        pension_deduction=pension_deduction,
        other_deductions=0,
        total_deductions=total_deductions,
        net_salary=net_salary,
        currency=current_user.currency,
        status="generated"
    )
    
    db.add(payslip)
    db.commit()
    db.refresh(payroll)
    return payroll

@router.get("/payroll/{payroll_id}", response_model=PayrollResponse)
def get_payroll(
    payroll_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payroll = db.query(Payroll).filter(
        Payroll.id == payroll_id,
        Payroll.organization_id == current_user.organization_id
    ).first()
    
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    
    return payroll

@router.put("/payroll/{payroll_id}", response_model=PayrollResponse)
def update_payroll(
    payroll_id: str,
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payroll = db.query(Payroll).filter(
        Payroll.id == payroll_id,
        Payroll.organization_id == current_user.organization_id
    ).first()
    
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    
    gross_salary = (payroll_data.basic_salary + 
                    payroll_data.allowances + 
                    payroll_data.overtime + 
                    payroll_data.bonuses)
    
    tax_deduction = calculate_tax(gross_salary, current_user.country)
    pension_deduction = gross_salary * PENSION_RATE
    total_deductions = tax_deduction + pension_deduction
    net_salary = gross_salary - total_deductions
    
    payroll.employee_id = payroll_data.employee_id
    payroll.employee_name = payroll_data.employee_name
    payroll.basic_salary = payroll_data.basic_salary
    payroll.allowances = payroll_data.allowances
    payroll.overtime = payroll_data.overtime
    payroll.bonuses = payroll_data.bonuses
    payroll.gross_salary = gross_salary
    payroll.tax_deduction = tax_deduction
    payroll.pension_deduction = pension_deduction
    payroll.total_deductions = total_deductions
    payroll.net_salary = net_salary
    payroll.pay_period = payroll_data.pay_period
    payroll.pay_date = payroll_data.pay_date or datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(payroll)
    return payroll

@router.post("/payroll/process-all", response_model=List[PayrollResponse])
def process_all_payroll(
    pay_period: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    employees = db.query(Employee).filter(
        Employee.organization_id == current_user.organization_id,
        Employee.status == "active"
    ).all()
    
    payroll_records = []
    
    for employee in employees:
        if not employee.salary:
            continue
        
        gross_salary = employee.salary
        tax_deduction = calculate_tax(gross_salary, current_user.country)
        pension_deduction = gross_salary * PENSION_RATE
        total_deductions = tax_deduction + pension_deduction
        net_salary = gross_salary - total_deductions
        
        payroll = Payroll(
            id=str(uuid.uuid4()),
            organization_id=current_user.organization_id,
            employee_id=employee.id,
            employee_name=f"{employee.first_name} {employee.last_name}",
            basic_salary=employee.salary,
            allowances=0,
            overtime=0,
            bonuses=0,
            gross_salary=gross_salary,
            tax_deduction=tax_deduction,
            pension_deduction=pension_deduction,
            other_deductions=0,
            total_deductions=total_deductions,
            net_salary=net_salary,
            pay_period=pay_period,
            pay_date=datetime.now(timezone.utc),
            status="processed"
        )
        
        db.add(payroll)
        
        payslip = Payslip(
            id=str(uuid.uuid4()),
            organization_id=current_user.organization_id,
            payroll_id=payroll.id,
            employee_id=employee.id,
            employee_name=f"{employee.first_name} {employee.last_name}",
            pay_period=pay_period,
            pay_date=datetime.now(timezone.utc),
            basic_salary=employee.salary,
            allowances=0,
            overtime=0,
            bonuses=0,
            gross_salary=gross_salary,
            tax_deduction=tax_deduction,
            pension_deduction=pension_deduction,
            other_deductions=0,
            total_deductions=total_deductions,
            net_salary=net_salary,
            currency=current_user.currency,
            status="generated"
        )
        
        db.add(payslip)
        payroll_records.append(payroll)
    
    db.commit()
    return payroll_records

@router.get("/payslips", response_model=List[PayslipResponse])
def get_payslips(
    employee_id: Optional[str] = None,
    pay_period: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payslip).filter(Payslip.organization_id == current_user.organization_id)
    
    if employee_id:
        query = query.filter(Payslip.employee_id == employee_id)
    if pay_period:
        query = query.filter(Payslip.pay_period == pay_period)
    
    payslips = query.order_by(Payslip.created_at.desc()).all()
    return payslips

@router.get("/payslips/{payslip_id}", response_model=PayslipResponse)
def get_payslip(
    payslip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payslip = db.query(Payslip).filter(
        Payslip.id == payslip_id,
        Payslip.organization_id == current_user.organization_id
    ).first()
    
    if not payslip:
        raise HTTPException(status_code=404, detail="Payslip not found")
    
    return payslip

@router.get("/payslips/employee/{employee_id}", response_model=List[PayslipResponse])
def get_employee_payslips(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payslips = db.query(Payslip).filter(
        Payslip.employee_id == employee_id,
        Payslip.organization_id == current_user.organization_id
    ).order_by(Payslip.created_at.desc()).all()
    
    return payslips

@router.post("/payslips/{payslip_id}/send", response_model=MessageResponse)
def send_payslip_email(
    payslip_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    payslip = db.query(Payslip).filter(
        Payslip.id == payslip_id,
        Payslip.organization_id == current_user.organization_id
    ).first()
    
    if not payslip:
        raise HTTPException(status_code=404, detail="Payslip not found")
    
    payslip.status = "sent"
    db.commit()
    
    return MessageResponse(message=f"Payslip for {payslip.pay_period} sent")

@router.get("/summary")
def get_payroll_summary(
    pay_period: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Payroll).filter(Payroll.organization_id == current_user.organization_id)
    
    if pay_period:
        query = query.filter(Payroll.pay_period == pay_period)
    
    payrolls = query.all()
    
    total_gross = sum(p.gross_salary for p in payrolls)
    total_net = sum(p.net_salary for p in payrolls)
    total_tax = sum(p.tax_deduction for p in payrolls)
    total_deductions = sum(p.total_deductions for p in payrolls)
    
    return {
        "total_gross_salary": total_gross,
        "total_net_salary": total_net,
        "total_tax_deductions": total_tax,
        "total_deductions": total_deductions,
        "employee_count": len(payrolls),
        "currency": current_user.currency,
        "pay_period": pay_period or "all"
    }
