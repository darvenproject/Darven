from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

# Landing Images
class LandingImageResponse(BaseModel):
    id: int
    category: str
    image_url: str
    portrait_image_url: Optional[str] = None
    title: str
    link: Optional[str] = None
    
    class Config:
        from_attributes = True

# Ready Made Products
class ReadyMadeProductCreate(BaseModel):
    name: str
    description: str
    price: float
    material: str
    size: str
    color: Optional[str] = None
    stock: int = 0

class ReadyMadeProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    material: str
    fabric_category: Optional[str] = None
    size: str
    colors: Optional[List[str]] = None
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
    fabric_category: Optional[str] = None
    colors: Optional[List[str]] = None
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
    colors: Optional[List[str]] = None
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

# Size Charts
class KameezSizeCreate(BaseModel):
    size: str  # XS, S, M, L, XL
    collar: float
    shoulder: float
    chest: float
    sleeves: float
    length: float

class KameezSizeResponse(BaseModel):
    id: int
    size: str
    collar: float
    shoulder: float
    chest: float
    sleeves: float
    length: float
    
    class Config:
        from_attributes = True

class ShalwarSizeCreate(BaseModel):
    size: str  # XS, S, M, L, XL
    length: float

class ShalwarSizeResponse(BaseModel):
    id: int
    size: str
    length: float
    
    class Config:
        from_attributes = True

class PajamaSizeCreate(BaseModel):
    size: str  # XS, S, M, L, XL
    length: float
    waist: float
    hips: float

class PajamaSizeResponse(BaseModel):
    id: int
    size: str
    length: float
    waist: float
    hips: float
    
    class Config:
        from_attributes = True

class UserMeasurements(BaseModel):
    # Kameez measurements
    collar: Optional[float] = None
    shoulder: Optional[float] = None
    chest: Optional[float] = None
    sleeves: Optional[float] = None
    kameez_length: Optional[float] = None
    
    # Shalwar measurements
    shalwar_length: Optional[float] = None
    
    # Pajama measurements
    pajama_length: Optional[float] = None
    waist: Optional[float] = None
    thigh: Optional[float] = None

class SizeRecommendation(BaseModel):
    recommended_size: str
    confidence: str  # "perfect", "good", "consider_custom"
    measurements: dict
    notes: List[str]
