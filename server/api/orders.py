from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Order, OrderStatus, Admin
from schemas import OrderCreate, OrderResponse
from auth import get_current_admin

router = APIRouter()

@router.post("", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Create new order
    new_order = Order(
        customer_name=order.customer_name,
        phone=order.phone,
        address=order.address,
        postal_code=order.postal_code,
        city=order.city,
        state=order.state,
        landmark=order.landmark,
        items=[item.dict() for item in order.items],
        subtotal=order.subtotal,
        delivery_charges=order.delivery_charges,
        total=order.total,
        status=OrderStatus.PENDING
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("", response_model=List[OrderResponse])
async def get_orders(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status: str,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Validate status
    try:
        new_status = OrderStatus[status.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    order.status = new_status
    db.commit()
    db.refresh(order)
    
    return order

@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    
    return {"message": "Order deleted successfully"}
