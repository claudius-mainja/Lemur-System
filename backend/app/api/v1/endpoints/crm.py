from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.database import get_db
from app.models.models import Lead, User
from app.schemas.schemas import LeadCreate, LeadResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[LeadResponse])
def get_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leads = db.query(Lead).filter(
        Lead.organization_id == current_user.organization_id
    ).order_by(Lead.created_at.desc()).all()
    return leads

@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.organization_id == current_user.organization_id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.post("/", response_model=LeadResponse)
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = Lead(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        name=lead_data.name,
        email=lead_data.email,
        phone=lead_data.phone,
        company=lead_data.company,
        source=lead_data.source,
        value=lead_data.value,
        notes=lead_data.notes,
        assigned_to=current_user.id
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead

@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: str,
    lead_data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.organization_id == current_user.organization_id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead.name = lead_data.name
    lead.email = lead_data.email
    lead.phone = lead_data.phone
    lead.company = lead_data.company
    lead.source = lead_data.source
    lead.value = lead_data.value
    lead.notes = lead_data.notes
    
    db.commit()
    db.refresh(lead)
    return lead

@router.patch("/{lead_id}/status", response_model=LeadResponse)
def update_lead_status(
    lead_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.organization_id == current_user.organization_id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead.status = status
    db.commit()
    db.refresh(lead)
    return lead

@router.delete("/{lead_id}", response_model=MessageResponse)
def delete_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.organization_id == current_user.organization_id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(lead)
    db.commit()
    return MessageResponse(message="Lead deleted successfully")

@router.get("/stats/summary")
def get_lead_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leads = db.query(Lead).filter(
        Lead.organization_id == current_user.organization_id
    ).all()
    
    total_value = sum(lead.value for lead in leads)
    new_leads = sum(1 for lead in leads if lead.status == "new")
    contacted = sum(1 for lead in leads if lead.status == "contacted")
    qualified = sum(1 for lead in leads if lead.status == "qualified")
    won = sum(1 for lead in leads if lead.status == "won")
    lost = sum(1 for lead in leads if lead.status == "lost")
    
    return {
        "total_leads": len(leads),
        "total_value": total_value,
        "new": new_leads,
        "contacted": contacted,
        "qualified": qualified,
        "won": won,
        "lost": lost
    }
