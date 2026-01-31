from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
from uuid import uuid4

from database import get_db
from models import Fabric, Admin
from schemas import FabricResponse
from auth import get_current_admin
from file_utils import upload_file_local, delete_multiple_files_local

router = APIRouter()

@router.get("", response_model=List[FabricResponse])
async def get_fabrics(db: Session = Depends(get_db)):
    fabrics = db.query(Fabric).all()
    return fabrics

@router.get("/{fabric_id}", response_model=FabricResponse)
async def get_fabric(fabric_id: int, db: Session = Depends(get_db)):
    fabric = db.query(Fabric).filter(Fabric.id == fabric_id).first()
    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    return fabric

@router.post("", response_model=FabricResponse)
async def create_fabric(
    name: str = Form(...),
    description: str = Form(...),
    price_per_meter: float = Form(...),
    material: str = Form(...),
    stock_meters: float = Form(0),
    files: List[UploadFile] = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Save images to local storage
    image_urls = []
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
        image_url = await upload_file_local(file, "fabrics", filename)
        image_urls.append(image_url)
    
    # Create fabric
    fabric = Fabric(
        name=name,
        description=description,
        price_per_meter=price_per_meter,
        material=material,
        stock_meters=stock_meters,
        images=image_urls
    )
    
    db.add(fabric)
    db.commit()
    db.refresh(fabric)
    
    return fabric

@router.put("/{fabric_id}", response_model=FabricResponse)
async def update_fabric(
    fabric_id: int,
    name: str = Form(None),
    description: str = Form(None),
    price_per_meter: float = Form(None),
    material: str = Form(None),
    stock_meters: float = Form(None),
    files: List[UploadFile] = File(None),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    fabric = db.query(Fabric).filter(Fabric.id == fabric_id).first()
    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    
    # Update fields
    if name is not None:
        fabric.name = name
    if description is not None:
        fabric.description = description
    if price_per_meter is not None:
        fabric.price_per_meter = price_per_meter
    if material is not None:
        fabric.material = material
    if stock_meters is not None:
        fabric.stock_meters = stock_meters
    
    # Update images if provided
    if files:
        # Delete old images from local storage
        delete_multiple_files_local(fabric.images)
        
        # Save new images to local storage
        image_urls = []
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            filename = f"{uuid4()}{file_extension}"
            image_url = await upload_file_local(file, "fabrics", filename)
            image_urls.append(image_url)
        
        fabric.images = image_urls
    
    db.commit()
    db.refresh(fabric)
    
    return fabric

@router.delete("/{fabric_id}")
async def delete_fabric(
    fabric_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    fabric = db.query(Fabric).filter(Fabric.id == fabric_id).first()
    if not fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    
    # Delete images from local storage
    delete_multiple_files_local(fabric.images)
    
    db.delete(fabric)
    db.commit()
    
    return {"message": "Fabric deleted successfully"}
