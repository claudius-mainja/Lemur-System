from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.database import get_db
from app.models.models import User, Tenant
from app.schemas.schemas import TenantResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.post("/register", response_model=dict)
def register_tenant(tenant_data: dict, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == tenant_data.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    from app.core.security import get_password_hash
    
    organization_id = str(uuid.uuid4())
    
    user = User(
        id=str(uuid.uuid4()),
        email=tenant_data.get("email"),
        password_hash=get_password_hash(tenant_data.get("password")),
        first_name=tenant_data.get("first_name", ""),
        last_name=tenant_data.get("last_name", ""),
        role="admin",
        organization_id=organization_id,
        organization_name=tenant_data.get("organization_name"),
        industry=tenant_data.get("industry", "other"),
        subscription=tenant_data.get("plan", "starter"),
        currency=tenant_data.get("currency", "ZAR"),
        country=tenant_data.get("country", "ZA"),
        is_active=True,
        is_on_trial=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    from app.core.security import create_access_token, create_refresh_token
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role.value if hasattr(user.role, 'value') else str(user.role),
            "organization_id": user.organization_id,
            "organization_name": user.organization_name,
            "industry": user.industry.value if hasattr(user.industry, 'value') else str(user.industry),
            "subscription": user.subscription.value if hasattr(user.subscription, 'value') else str(user.subscription),
            "currency": user.currency,
            "country": user.country,
            "is_active": user.is_active,
            "is_on_trial": user.is_on_trial
        }
    }

@router.get("/", response_model=List[dict])
def get_tenants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).filter(
        User.organization_id == current_user.organization_id
    ).all()
    
    return [{
        "id": user.organization_id,
        "name": user.organization_name,
        "email": user.email,
        "industry": user.industry.value if hasattr(user.industry, 'value') else str(user.industry),
        "plan": user.subscription.value if hasattr(user.subscription, 'value') else str(user.subscription),
        "status": "active" if user.is_active else "inactive",
        "created_at": user.created_at
    } for user in users]

@router.get("/{tenant_id}", response_model=dict)
def get_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if tenant_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    users = db.query(User).filter(
        User.organization_id == tenant_id
    ).all()
    
    return {
        "id": tenant_id,
        "name": users[0].organization_name if users else "Unknown",
        "users_count": len(users),
        "active_users": len([u for u in users if u.is_active]),
        "plan": users[0].subscription.value if users and hasattr(users[0].subscription, 'value') else str(users[0].subscription) if users else "starter",
    }

@router.put("/{tenant_id}", response_model=dict)
def update_tenant(
    tenant_id: str,
    tenant_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if tenant_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if current_user.role.value != "admin" if hasattr(current_user.role, 'value') else str(current_user.role) != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update tenant")
    
    users = db.query(User).filter(
        User.organization_id == tenant_id
    ).all()
    
    for user in users:
        if tenant_data.get("name"):
            user.organization_name = tenant_data.get("name")
        if tenant_data.get("plan"):
            user.subscription = tenant_data.get("plan")
    
    db.commit()
    
    return {"message": "Tenant updated successfully"}

@router.get("/{tenant_id}/settings")
def get_tenant_settings(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if tenant_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "currency": current_user.currency,
        "country": current_user.country,
        "timezone": "Africa/Johannesburg",
        "language": "en",
    }

@router.get("/{tenant_id}/modules")
def get_tenant_modules(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if tenant_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    plan = current_user.subscription.value if hasattr(current_user.subscription, 'value') else str(current_user.subscription)
    
    modules = {
        "starter": ["hr", "finance", "supply-chain"],
        "professional": ["hr", "finance", "crm", "payroll", "productivity", "supply-chain"],
        "enterprise": ["hr", "finance", "crm", "payroll", "productivity", "supply-chain", "email", "documents"]
    }
    
    return {
        "plan": plan,
        "modules": modules.get(plan, modules["starter"])
    }
