from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import json
from uuid import uuid4

from database import get_db
from models import NewCollectionProduct, Admin
from schemas import ReadyMadeProductResponse
from auth import get_current_admin
from file_utils import upload_file_local, delete_multiple_files_local

router = APIRouter()

@router.get("", response_model=List[ReadyMadeProductResponse])
async def get_new_collection_products(db: Session = Depends(get_db)):
    products = db.query(NewCollectionProduct).all()
    return products

@router.get("/{product_id}", response_model=ReadyMadeProductResponse)
async def get_new_collection_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(NewCollectionProduct).filter(NewCollectionProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ReadyMadeProductResponse)
async def create_new_collection_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    material: str = Form(...),
    fabric_category: str = Form(None),
    size: str = Form(...),
    colors: Optional[str] = Form(None),
    stock: int = Form(0),
    files: List[UploadFile] = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    image_urls = []
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
        image_url = await upload_file_local(file, "new-collection", filename)
        image_urls.append(image_url)
    
    colors_list = None
    if colors:
        try:
            colors_list = json.loads(colors)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid colors JSON format")
    
    product = NewCollectionProduct(
        name=name,
        description=description,
        price=price,
        material=material,
        fabric_category=fabric_category,
        size=size,
        colors=colors_list,
        stock=stock,
        images=image_urls
    )
    
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product

@router.put("/{product_id}", response_model=ReadyMadeProductResponse)
async def update_new_collection_product(
    product_id: int,
    name: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    material: str = Form(None),
    fabric_category: str = Form(None),
    size: str = Form(None),
    colors: Optional[str] = Form(None),
    stock: int = Form(None),
    files: List[UploadFile] = File(None),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(NewCollectionProduct).filter(NewCollectionProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if name is not None:
        product.name = name
    if description is not None:
        product.description = description
    if price is not None:
        product.price = price
    if material is not None:
        product.material = material
    if fabric_category is not None:
        product.fabric_category = fabric_category
    if size is not None:
        product.size = size
    if stock is not None:
        product.stock = stock
    
    if colors is not None:
        try:
            product.colors = json.loads(colors)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid colors JSON format")
    
    if files:
        delete_multiple_files_local(product.images)
        image_urls = []
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"{uuid4()}{file_extension}"
            image_url = await upload_file_local(file, "new-collection", filename)
            image_urls.append(image_url)
        product.images = image_urls
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/{product_id}")
async def delete_new_collection_product(
    product_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(NewCollectionProduct).filter(NewCollectionProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    delete_multiple_files_local(product.images)
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}