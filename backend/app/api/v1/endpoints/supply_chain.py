from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.database import get_db
from app.models.models import Inventory, User
from app.schemas.schemas import InventoryCreate, InventoryResponse, MessageResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[InventoryResponse])
def get_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = db.query(Inventory).filter(
        Inventory.organization_id == current_user.organization_id
    ).all()
    return items

@router.get("/{item_id}", response_model=InventoryResponse)
def get_inventory_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Inventory).filter(
        Inventory.id == item_id,
        Inventory.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

@router.post("/", response_model=InventoryResponse)
def create_inventory_item(
    item_data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_value = item_data.quantity * item_data.unit_price
    status = "in_stock"
    if item_data.quantity == 0:
        status = "out_of_stock"
    elif item_data.quantity < item_data.min_quantity:
        status = "low_stock"
    
    item = Inventory(
        id=str(uuid.uuid4()),
        organization_id=current_user.organization_id,
        name=item_data.name,
        sku=item_data.sku,
        category=item_data.category,
        quantity=item_data.quantity,
        min_quantity=item_data.min_quantity,
        unit_price=item_data.unit_price,
        total_value=total_value,
        status=status,
        supplier=item_data.supplier
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=InventoryResponse)
def update_inventory_item(
    item_id: str,
    item_data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Inventory).filter(
        Inventory.id == item_id,
        Inventory.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    total_value = item_data.quantity * item_data.unit_price
    status = "in_stock"
    if item_data.quantity == 0:
        status = "out_of_stock"
    elif item_data.quantity < item_data.min_quantity:
        status = "low_stock"
    
    item.name = item_data.name
    item.sku = item_data.sku
    item.category = item_data.category
    item.quantity = item_data.quantity
    item.min_quantity = item_data.min_quantity
    item.unit_price = item_data.unit_price
    item.total_value = total_value
    item.status = status
    item.supplier = item_data.supplier
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", response_model=MessageResponse)
def delete_inventory_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Inventory).filter(
        Inventory.id == item_id,
        Inventory.organization_id == current_user.organization_id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(item)
    db.commit()
    return MessageResponse(message="Inventory item deleted successfully")

@router.get("/stats/summary")
def get_inventory_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = db.query(Inventory).filter(
        Inventory.organization_id == current_user.organization_id
    ).all()
    
    total_value = sum(item.total_value for item in items)
    low_stock = sum(1 for item in items if item.status == "low_stock")
    out_of_stock = sum(1 for item in items if item.status == "out_of_stock")
    
    return {
        "total_items": len(items),
        "total_value": total_value,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock,
        "in_stock": len(items) - low_stock - out_of_stock
    }
