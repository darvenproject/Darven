from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import json
from uuid import uuid4

from database import get_db
from models import ReadyMadeProduct, Admin
from schemas import ReadyMadeProductResponse
from auth import get_current_admin

router = APIRouter()

@router.get("", response_model=List[ReadyMadeProductResponse])
async def get_ready_made_products(db: Session = Depends(get_db)):
    products = db.query(ReadyMadeProduct).all()
    return products

@router.get("/{product_id}", response_model=ReadyMadeProductResponse)
async def get_ready_made_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ReadyMadeProduct).filter(ReadyMadeProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ReadyMadeProductResponse)
async def create_ready_made_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    material: str = Form(...),
    size: str = Form(...),
    stock: int = Form(0),
    files: List[UploadFile] = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Save images
    image_urls = []
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
        file_path = f"uploads/ready-made/{filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        image_urls.append(f"/uploads/ready-made/{filename}")
    
    # Create product
    product = ReadyMadeProduct(
        name=name,
        description=description,
        price=price,
        material=material,
        size=size,
        stock=stock,
        images=image_urls
    )
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product

@router.put("/{product_id}", response_model=ReadyMadeProductResponse)
async def update_ready_made_product(
    product_id: int,
    name: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    material: str = Form(None),
    size: str = Form(None),
    stock: int = Form(None),
    files: List[UploadFile] = File(None),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(ReadyMadeProduct).filter(ReadyMadeProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields
    if name is not None:
        product.name = name
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if material is not None:
        product.material = material
    if size is not None:
        product.size = size
    if stock is not None:
        product.stock = stock
    
    # Update images if provided
    if files:
        # Delete old images
        for image_url in product.images:
            image_path = image_url.replace("/uploads/", "uploads/")
            if os.path.exists(image_path):
                os.remove(image_path)
        
        # Save new images
        image_urls = []
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"{uuid4()}{file_extension}"
            file_path = f"uploads/ready-made/{filename}"
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            image_urls.append(f"/uploads/ready-made/{filename}")
        
        product.images = image_urls
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/{product_id}")
async def delete_ready_made_product(
    product_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(ReadyMadeProduct).filter(ReadyMadeProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Delete images
    for image_url in product.images:
        image_path = image_url.replace("/uploads/", "uploads/")
        if os.path.exists(image_path):
            os.remove(image_path)
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}
