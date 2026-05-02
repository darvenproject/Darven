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
from file_utils import upload_file_local, delete_file_local, delete_multiple_files_local

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
    # ── new image management params ──────────────────────────────────────────
    image_mode: str = Form("add"),           # "add" | "replace"
    images_to_delete: Optional[str] = Form(None),   # JSON array of URLs to delete
    existing_images: Optional[str] = Form(None),    # JSON array of URLs to keep
    # ─────────────────────────────────────────────────────────────────────────
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(NewCollectionProduct).filter(NewCollectionProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # ── update scalar fields ─────────────────────────────────────────────────
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

    # ── image management ─────────────────────────────────────────────────────
    current_images: list = list(product.images or [])

    if image_mode == "replace":
        # Delete every existing image from disk, then save only the new uploads
        delete_multiple_files_local(current_images)
        current_images = []

    else:
        # "add" mode — delete only the images the admin explicitly marked for removal
        if images_to_delete:
            try:
                to_delete: list = json.loads(images_to_delete)
            except json.JSONDecodeError:
                to_delete = []

            for url in to_delete:
                delete_file_local(url)
                if url in current_images:
                    current_images.remove(url)

        # If the frontend also sent the ordered kept-list, honour that ordering
        if existing_images:
            try:
                kept: list = json.loads(existing_images)
                # Only trust URLs that are actually in current_images
                valid_current = set(current_images)
                current_images = [u for u in kept if u in valid_current]
            except json.JSONDecodeError:
                pass  # fall back to current_images as-is

    # Upload any new files and append (or set if replace mode)
    if files:
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"{uuid4()}{file_extension}"
            image_url = await upload_file_local(file, "new-collection", filename)
            current_images.append(image_url)

    product.images = current_images
    # ─────────────────────────────────────────────────────────────────────────

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