from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
import json
from datetime import datetime

from app.db.database import get_db
from app.models.models import Invoice, InvoiceItem, User
from app.schemas.schemas import InvoiceCreate, InvoiceResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

def generate_invoice_number():
    timestamp = datetime.now().strftime("%Y%m%d")
    random_suffix = str(uuid.uuid4())[:6].upper()
    return f"INV-{timestamp}-{random_suffix}"

@router.get("/", response_model=List[InvoiceResponse])
def get_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = db.query(Invoice).filter(
        Invoice.organization_id == current_user.organization_id
    ).order_by(Invoice.created_at.desc()).all()
    return invoices

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.organization_id == current_user.organization_id
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/", response_model=InvoiceResponse)
def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subtotal = sum(item.unit_price * item.quantity for item in invoice_data.items)
    tax = subtotal * 0.15  # 15% tax
    total = subtotal + tax
    
    invoice = Invoice(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        invoice_number=generate_invoice_number(),
        customer_id=invoice_data.customer_id,
        customer_name=invoice_data.customer_name,
        customer_email=invoice_data.customer_email,
        subtotal=subtotal,
        tax=tax,
        total=total,
        due_date=invoice_data.due_date,
        notes=invoice_data.notes,
        items=json.dumps([item.model_dump() for item in invoice_data.items])
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

@router.put("/{invoice_id}", response_model=InvoiceResponse)
def update_invoice(
    invoice_id: str,
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.organization_id == current_user.organization_id
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    subtotal = sum(item.unit_price * item.quantity for item in invoice_data.items)
    tax = subtotal * 0.15
    total = subtotal + tax
    
    invoice.customer_id = invoice_data.customer_id
    invoice.customer_name = invoice_data.customer_name
    invoice.customer_email = invoice_data.customer_email
    invoice.subtotal = subtotal
    invoice.tax = tax
    invoice.total = total
    invoice.due_date = invoice_data.due_date
    invoice.notes = invoice_data.notes
    invoice.items = json.dumps([item.model_dump() for item in invoice_data.items])
    
    db.commit()
    db.refresh(invoice)
    return invoice

@router.patch("/{invoice_id}/status", response_model=InvoiceResponse)
def update_invoice_status(
    invoice_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.organization_id == current_user.organization_id
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.status = status
    db.commit()
    db.refresh(invoice)
    return invoice

@router.delete("/{invoice_id}", response_model=MessageResponse)
def delete_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.organization_id == current_user.organization_id
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    db.delete(invoice)
    db.commit()
    return MessageResponse(message="Invoice deleted successfully")

@router.get("/stats/summary")
def get_invoice_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = db.query(Invoice).filter(
        Invoice.organization_id == current_user.organization_id
    ).all()
    
    total = sum(inv.total for inv in invoices)
    paid = sum(inv.total for inv in invoices if inv.status == "paid")
    pending = sum(inv.total for inv in invoices if inv.status == "sent")
    overdue = sum(inv.total for inv in invoices if inv.status == "overdue")
    
    return {
        "total": total,
        "paid": paid,
        "pending": pending,
        "overdue": overdue,
        "count": len(invoices)
    }
