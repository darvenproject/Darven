from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import Admin, Order, OrderStatus
from schemas import AdminLogin, AdminToken, RevenueResponse
from auth import verify_password, create_access_token, get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES, init_admin

router = APIRouter()

@router.post("/login", response_model=AdminToken)
async def login(credentials: AdminLogin, db: Session = Depends(get_db)):
    # Initialize admin if not exists
    init_admin(db)
    
    admin = db.query(Admin).filter(Admin.username == credentials.username).first()
    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/revenue", response_model=RevenueResponse)
async def get_revenue(
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    completed_orders = db.query(Order).filter(Order.status == OrderStatus.COMPLETED).all()
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).all()
    total_orders = db.query(Order).count()
    
    total_revenue = sum(order.total for order in completed_orders)
    
    return {
        "total_revenue": total_revenue,
        "pending_orders": len(pending_orders),
        "completed_orders": len(completed_orders),
        "total_orders": total_orders
    }

@router.get("/verify")
async def verify_admin(admin: Admin = Depends(get_current_admin)):
    return {"username": admin.username}
