from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Enum as SQLEnum, Text
from sqlalchemy.sql import func
from database import Base
import enum

class OrderStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class LandingImage(Base):
    __tablename__ = "landing_images"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    image_url = Column(String)
    portrait_image_url = Column(String, nullable=True)
    title = Column(String)
    link = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ReadyMadeProduct(Base):
    __tablename__ = "ready_made_products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    material = Column(String)
    fabric_category = Column(String, nullable=True, index=True)
    size = Column(String)
    colors = Column(JSON, nullable=True)
    images = Column(JSON)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# NEW: New Collection Product — same structure as ReadyMadeProduct, separate table
class NewCollectionProduct(Base):
    __tablename__ = "new_collection_products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    material = Column(String)
    fabric_category = Column(String, nullable=True, index=True)
    size = Column(String)
    colors = Column(JSON, nullable=True)
    images = Column(JSON)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class WaistCoatProduct(Base):
    __tablename__ = "waist_coat_products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    material = Column(String)
    fabric_category = Column(String, nullable=True, index=True)
    size = Column(String)
    colors = Column(JSON, nullable=True)
    images = Column(JSON)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Fabric(Base):
    __tablename__ = "fabrics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price_per_meter = Column(Float)
    material = Column(String)
    fabric_category = Column(String, nullable=True, index=True)
    colors = Column(JSON, nullable=True)
    images = Column(JSON)
    stock_meters = Column(Float, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CustomFabric(Base):
    __tablename__ = "custom_fabrics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    material = Column(String)
    colors = Column(JSON, nullable=True)
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    phone = Column(String)
    address = Column(Text)
    postal_code = Column(String)
    city = Column(String)
    state = Column(String)
    landmark = Column(String, nullable=True)
    items = Column(JSON)
    subtotal = Column(Float)
    delivery_charges = Column(Float, default=200.0)
    total = Column(Float)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SizeType(enum.Enum):
    XS = "XS"
    S = "S"
    M = "M"
    L = "L"
    XL = "XL"

class KameezSize(Base):
    __tablename__ = "kameez_sizes"
    
    id = Column(Integer, primary_key=True, index=True)
    size = Column(SQLEnum(SizeType), unique=True, index=True)
    collar = Column(Float)
    shoulder = Column(Float)
    chest = Column(Float)
    sleeves = Column(Float)
    length = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ShalwarSize(Base):
    __tablename__ = "shalwar_sizes"
    
    id = Column(Integer, primary_key=True, index=True)
    size = Column(SQLEnum(SizeType), unique=True, index=True)
    length = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PajamaSize(Base):
    __tablename__ = "pajama_sizes"
    
    id = Column(Integer, primary_key=True, index=True)
    size = Column(SQLEnum(SizeType), unique=True, index=True)
    length = Column(Float)
    waist = Column(Float)
    hips = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())