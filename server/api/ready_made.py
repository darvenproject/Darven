from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import json
from uuid import uuid4

from database import get_db
from models import ReadyMadeProduct, Admin
from schemas import ReadyMadeProductResponse
from auth import get_current_admin
from file_utils import upload_file_local, delete_multiple_files_local

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
    color: str = Form(None),
    stock: int = Form(0),
    files: List[UploadFile] = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Save images to local storage
    image_urls = []
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
        image_url = await upload_file_local(file, "ready-made", filename)
        image_urls.append(image_url)
    
    # Create product
    product = ReadyMadeProduct(
        name=name,
        description=description,
        price=price,
        material=material,
        size=size,
        color=color,
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
    color: str = Form(None),
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
    if color is not None:
        product.color = color
    if stock is not None:
        product.stock = stock
    
    # Update images if provided
    if files:
        # Delete old images from local storage
        delete_multiple_files_local(product.images)
        
        # Save new images to local storage
        image_urls = []
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"{uuid4()}{file_extension}"
            image_url = await upload_file_local(file, "ready-made", filename)
            image_urls.append(image_url)
        
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
    
    # Delete images from local storage
    delete_multiple_files_local(product.images)
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}
