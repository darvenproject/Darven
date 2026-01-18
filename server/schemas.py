from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# Landing Images
class LandingImageResponse(BaseModel):
    id: int
    category: str
    image_url: str
    title: str
    link: str
    
    class Config:
        from_attributes = True

# Ready Made Products
class ReadyMadeProductCreate(BaseModel):
    name: str
    description: str
    price: float
    material: str
    size: str
    stock: int = 0

class ReadyMadeProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    material: str
    size: str
    images: List[str]
    stock: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Fabrics
class FabricCreate(BaseModel):
    name: str
    description: str
    price_per_meter: float
    material: str
    stock_meters: float = 0

class FabricResponse(BaseModel):
    id: int
    name: str
    description: str
    price_per_meter: float
    material: str
    images: List[str]
    stock_meters: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# Custom Fabrics
class CustomFabricResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    material: str
    image_url: str
    
    class Config:
        from_attributes = True

# Orders
class OrderItem(BaseModel):
    id: str
    type: str  # ready-made, custom, fabric
    name: str
    price: float
    quantity: int
    image: str
    details: Optional[dict] = None

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    address: str
    postal_code: str
    city: str
    state: str
    landmark: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    delivery_charges: float = 200.0
    total: float

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    phone: str
    address: str
    postal_code: str
    city: str
    state: str
    landmark: Optional[str]
    items: List[dict]
    subtotal: float
    delivery_charges: float
    total: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Admin
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str

# Revenue
class RevenueResponse(BaseModel):
    total_revenue: float
    pending_orders: int
    completed_orders: int
    total_orders: int
