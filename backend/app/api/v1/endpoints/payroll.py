from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.database import get_db
from app.models.models import Payroll, User
from app.schemas.schemas import PayrollCreate, PayrollResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[PayrollResponse])
def get_payroll_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(Payroll).filter(
        Payroll.organization_id == current_user.organization_id
    ).order_by(Payroll.created_at.desc()).all()
    return records

@router.get("/{payroll_id}", response_model=PayrollResponse)
def get_payroll_record(
    payroll_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(Payroll).filter(
        Payroll.id == payroll_id,
        Payroll.organization_id == current_user.organization_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    return record

@router.post("/", response_model=PayrollResponse)
def create_payroll_record(
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    net_salary = payroll_data.basic_salary - payroll_data.deductions + payroll_data.bonuses
    
    record = Payroll(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        employee_id=payroll_data.employee_id,
        employee_name=payroll_data.employee_name,
        basic_salary=payroll_data.basic_salary,
        deductions=payroll_data.deductions,
        bonuses=payroll_data.bonuses,
        net_salary=net_salary,
        pay_date=payroll_data.pay_date
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.put("/{payroll_id}", response_model=PayrollResponse)
def update_payroll_record(
    payroll_id: str,
    payroll_data: PayrollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(Payroll).filter(
        Payroll.id == payroll_id,
        Payroll.organization_id == current_user.organization_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    
    net_salary = payroll_data.basic_salary - payroll_data.deductions + payroll_data.bonuses
    
    record.employee_id = payroll_data.employee_id
    record.employee_name = payroll_data.employee_name
    record.basic_salary = payroll_data.basic_salary
    record.deductions = payroll_data.deductions
    record.bonuses = payroll_data.bonuses
    record.net_salary = net_salary
    record.pay_date = payroll_data.pay_date
    
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{payroll_id}", response_model=MessageResponse)
def delete_payroll_record(
    payroll_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(Payroll).filter(
        Payroll.id == payroll_id,
        Payroll.organization_id == current_user.organization_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    
    db.delete(record)
    db.commit()
    return MessageResponse(message="Payroll record deleted successfully")

@router.get("/stats/summary")
def get_payroll_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    records = db.query(Payroll).filter(
        Payroll.organization_id == current_user.organization_id
    ).all()
    
    total_salaries = sum(r.basic_salary for r in records)
    total_deductions = sum(r.deductions for r in records)
    total_bonuses = sum(r.bonuses for r in records)
    total_net = sum(r.net_salary for r in records)
    
    return {
        "total_salaries": total_salaries,
        "total_deductions": total_deductions,
        "total_bonuses": total_bonuses,
        "total_net": total_net,
        "count": len(records)
    }
