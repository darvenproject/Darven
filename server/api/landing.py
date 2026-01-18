from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
from uuid import uuid4

from database import get_db
from models import LandingImage, Admin
from schemas import LandingImageResponse
from auth import get_current_admin

router = APIRouter()

@router.get("", response_model=List[LandingImageResponse])
async def get_landing_images(db: Session = Depends(get_db)):
    images = db.query(LandingImage).all()
    
    # If no images, return defaults
    if not images:
        return [
            {"id": 1, "category": "ready-made", "image_url": "/placeholder-ready.jpg", "title": "Ready Made", "link": "/ready-made"},
            {"id": 2, "category": "stitch-your-own", "image_url": "/placeholder-stitch.jpg", "title": "Stitch Your Own Suit", "link": "/stitch-your-own"},
            {"id": 3, "category": "fabric", "image_url": "/placeholder-fabric.jpg", "title": "Fabric", "link": "/fabric"},
        ]
    
    return images

@router.post("/{category}")
async def update_landing_image(
    category: str,
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Validate category
    valid_categories = ["ready-made", "stitch-your-own", "fabric"]
    if category not in valid_categories:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{category}-{uuid4()}{file_extension}"
    file_path = f"uploads/landing/{filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update or create landing image
    landing_image = db.query(LandingImage).filter(LandingImage.category == category).first()
    
    title_map = {
        "ready-made": "Ready Made",
        "stitch-your-own": "Stitch Your Own Suit",
        "fabric": "Fabric"
    }
    link_map = {
        "ready-made": "/ready-made",
        "stitch-your-own": "/stitch-your-own",
        "fabric": "/fabric"
    }
    
    if landing_image:
        # Delete old image if exists
        if landing_image.image_url and os.path.exists(landing_image.image_url):
            os.remove(landing_image.image_url)
        
        landing_image.image_url = f"/uploads/landing/{filename}"
    else:
        landing_image = LandingImage(
            category=category,
            image_url=f"/uploads/landing/{filename}",
            title=title_map[category],
            link=link_map[category]
        )
        db.add(landing_image)
    
    db.commit()
    db.refresh(landing_image)
    
    return landing_image
