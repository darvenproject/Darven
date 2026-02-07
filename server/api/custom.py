from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified
import json
from typing import List
import os
from uuid import uuid4

from database import get_db
from models import CustomFabric, Admin
from schemas import CustomFabricResponse
from auth import get_current_admin
from file_utils import upload_file_local, delete_file_local

router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://shopdarven.pk").rstrip("/")


@router.get("", response_model=List[CustomFabricResponse])
async def get_custom_fabrics(db: Session = Depends(get_db)):
    fabrics = db.query(CustomFabric).all()
    print(f"📋 Fetching {len(fabrics)} custom fabrics")
    for fabric in fabrics:
        print(f"  - {fabric.name}: colors={fabric.colors}, image={fabric.image_url}")

    if not fabrics:
        default_fabrics = [
            CustomFabric(
                name="Premium Cotton",
                description="High-quality cotton fabric, perfect for summer wear",
                price=3000,
                material="Cotton",
                image_url=f"{FRONTEND_URL}/placeholder-cotton.jpg"
            ),
            CustomFabric(
                name="Premium Lawn",
                description="Lightweight lawn fabric, ideal for hot weather",
                price=3500,
                material="Lawn",
                image_url=f"{FRONTEND_URL}/placeholder-lawn.jpg"
            ),
            CustomFabric(
                name="Premium Khaddar",
                description="Traditional khaddar fabric, perfect for winter",
                price=4000,
                material="Khaddar",
                image_url=f"{FRONTEND_URL}/placeholder-khaddar.jpg"
            ),
            CustomFabric(
                name="Premium Linen",
                description="Premium linen fabric with excellent breathability",
                price=4500,
                material="Linen",
                image_url=f"{FRONTEND_URL}/placeholder-linen.jpg"
            ),
            CustomFabric(
                name="Premium Wash & Wear",
                description="Easy-care wash and wear fabric",
                price=3200,
                material="Wash & Wear",
                image_url=f"{FRONTEND_URL}/placeholder-washnwear.jpg"
            ),
        ]

        for fabric in default_fabrics:
            db.add(fabric)
        db.commit()

        fabrics = db.query(CustomFabric).all()

    return fabrics


@router.post("", response_model=CustomFabricResponse)
async def create_custom_fabric(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    material: str = Form(...),
    colors: str = Form(None),  # JSON string of color array
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    print(f"📝 Creating custom fabric: {name}")
    print(f"Colors received (raw): {colors}")
    
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid4()}{file_extension}"
    image_url = await upload_file_local(file, "custom-fabrics", filename)
    print(f"Image uploaded to: {image_url}")

    # Parse colors from JSON string
    colors_list = None
    if colors:
        import json
        try:
            colors_list = json.loads(colors)
            print(f"Colors parsed successfully: {colors_list}")
        except Exception as e:
            print(f"Failed to parse colors: {e}")
            colors_list = None
    else:
        print("No colors provided")

    custom_fabric = CustomFabric(
        name=name,
        description=description,
        price=price,
        material=material,
        colors=colors_list,
        image_url=image_url
    )

    print(f"About to commit. Fabric colors before commit: {custom_fabric.colors}")
    db.add(custom_fabric)
    db.commit()
    print(f"Committed to database")
    db.refresh(custom_fabric)
    print(f"After refresh from DB. Fabric colors: {custom_fabric.colors}, type: {type(custom_fabric.colors)}")
    
    print(f"✅ Created fabric with colors: {custom_fabric.colors}")

    return custom_fabric


@router.put("/{fabric_id}", response_model=CustomFabricResponse)
async def update_custom_fabric(
    fabric_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db),
    name: str = Form(None),
    description: str = Form(None),
    price: float = Form(None),
    material: str = Form(None),
    colors: str = Form(None),  # JSON string of color array
    file: UploadFile = File(None)
):
    print(f"📝 Updating custom fabric ID: {fabric_id}")
    print(f"Colors received (raw): {colors}")
    
    fabric = db.query(CustomFabric).filter(CustomFabric.id == fabric_id).first()
    if not fabric:
        raise HTTPException(status_code=404, detail="Custom fabric not found")
    
    print(f"Current fabric colors: {fabric.colors}")

    if name is not None:
        fabric.name = name
    if description is not None:
        fabric.description = description
    if price is not None:
        fabric.price = price
    if material is not None:
        fabric.material = material
    
    # Parse colors from JSON string
    if colors is not None:
        import json
        try:
            colors_list = json.loads(colors)
            print(f"Colors parsed: {colors_list}, type: {type(colors_list)}")
            # Explicitly set as a Python list
            fabric.colors = colors_list
            
            # --- START OF FIX ---
            # Tell SQLAlchemy that the JSON column 'colors' has been modified
            flag_modified(fabric, "colors")
            # --- END OF FIX ---
            
            print(f"Colors updated to: {fabric.colors}, type: {type(fabric.colors)}")
        except Exception as e:
            print(f"Failed to parse colors: {e}")
            pass
    else:
        print("No colors in update request")

    if file:
        print(f"Uploading new file: {file.filename}")
        if fabric.image_url:
            delete_file_local(fabric.image_url)

        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
        fabric.image_url = await upload_file_local(file, "custom-fabrics", filename)
        print(f"New image URL: {fabric.image_url}")
    else:
        print(f"No new file, keeping existing: {fabric.image_url}")

    print(f"About to commit. Fabric colors before commit: {fabric.colors}")
    db.commit()
    print(f"Committed to database")
    db.refresh(fabric)
    print(f"After refresh from DB. Fabric colors: {fabric.colors}, type: {type(fabric.colors)}")
    
    print(f"✅ Updated fabric. Final colors: {fabric.colors}, Final image: {fabric.image_url}")

    return fabric


@router.delete("/{fabric_id}")
async def delete_custom_fabric(
    fabric_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    fabric = db.query(CustomFabric).filter(CustomFabric.id == fabric_id).first()
    if not fabric:
        raise HTTPException(status_code=404, detail="Custom fabric not found")

    if fabric.image_url and fabric.image_url.startswith("https://api.shopdarven.pk"):
        delete_file_local(fabric.image_url)

    db.delete(fabric)
    db.commit()

    return {"message": "Custom fabric deleted successfully"}