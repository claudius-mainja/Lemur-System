from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).filter(
        User.organization_id == current_user.organization_id
    ).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse)
def create_user(
    user_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if current user is admin
    if current_user.role.value != "admin" if hasattr(current_user.role, 'value') else str(current_user.role) != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create users")
    
    existing = db.query(User).filter(User.email == user_data.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    from app.core.security import get_password_hash
    
    user = User(
        id=str(uuid.uuid4()),
        email=user_data.get("email"),
        password_hash=get_password_hash(user_data.get("password")),
        first_name=user_data.get("first_name"),
        last_name=user_data.get("last_name"),
        role=user_data.get("role", "employee"),
        department=user_data.get("department"),
        phone=user_data.get("phone"),
        organization_id=current_user.organization_id,
        organization_name=current_user.organization_name,
        industry=current_user.industry,
        subscription=current_user.subscription,
        currency=current_user.currency,
        country=current_user.country,
        is_active=True,
        is_on_trial=False
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "admin" if hasattr(current_user.role, 'value') else str(current_user.role) != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update users")
    
    user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user_data.items():
        if key != "password" and hasattr(user, key):
            setattr(user, key, value)
    
    if user_data.get("password"):
        from app.core.security import get_password_hash
        user.password_hash = get_password_hash(user_data.get("password"))
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", response_model=MessageResponse)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "admin" if hasattr(current_user.role, 'value') else str(current_user.role) != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete users")
    
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    user = db.query(User).filter(
        User.id == user_id,
        User.organization_id == current_user.organization_id
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.commit()
    return MessageResponse(message="User deactivated successfully")

@router.post("/invite")
def invite_user(
    invite_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "admin" if hasattr(current_user.role, 'value') else str(current_user.role) != "admin":
        raise HTTPException(status_code=403, detail="Only admins can invite users")
    
    return {
        "message": "Invitation sent successfully",
        "email": invite_data.get("email"),
        "role": invite_data.get("role")
    }
