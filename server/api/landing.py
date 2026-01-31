from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
from uuid import uuid4

from database import get_db
from models import LandingImage, Admin
from schemas import LandingImageResponse
from auth import get_current_admin
from file_utils import upload_file_local, delete_file_local

router = APIRouter()

@router.get("", response_model=List[LandingImageResponse])
async def get_landing_images(db: Session = Depends(get_db)):
    images = db.query(LandingImage).all()
    
    # If no images, return defaults
    if not images:
        return [
            {"id": 1, "category": "ready-made", "image_url": "/placeholder.jpg", "title": "Ready Made", "link": "/ready-made"},
            {"id": 2, "category": "stitch-your-own", "image_url": "/placeholder.jpg", "title": "Stitch Your Own Suit", "link": "/stitch-your-own"},
            {"id": 3, "category": "fabric", "image_url": "/placeholder.jpg", "title": "Fabric", "link": "/fabric"},
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
    valid_categories = ["ready-made", "stitch-your-own", "fabric", "hero"]
    if category not in valid_categories:
        raise HTTPException(status_code=400, detail="Invalid category")
    
    # Save file to S3
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{category}-{uuid4()}{file_extension}"
    image_url = await upload_file_local(file, "landing", filename)
    
    title_map = {
        "ready-made": "Ready Made",
        "stitch-your-own": "Stitch Your Own Suit",
        "fabric": "Fabric",
        "hero": "Hero Section"
    }
    link_map = {
        "ready-made": "/ready-made",
        "stitch-your-own": "/stitch-your-own",
        "fabric": "/fabric",
        "hero": None
    }
    
    # For hero category, always create new images (multiple allowed)
    # For other categories, update existing
    if category == "hero":
        landing_image = LandingImage(
            category=category,
            image_url=image_url,
            title=title_map[category],
            link=link_map[category]
        )
        db.add(landing_image)
    else:
        # Update or create landing image (single per category)
        landing_image = db.query(LandingImage).filter(LandingImage.category == category).first()
        
        if landing_image:
            # Delete old image from S3 if exists
            if landing_image.image_url:
                delete_file_local(landing_image.image_url)
            
            landing_image.image_url = image_url
        else:
            landing_image = LandingImage(
                category=category,
                image_url=image_url,
                title=title_map[category],
                link=link_map[category]
            )
            db.add(landing_image)
    
    db.commit()
    db.refresh(landing_image)
    
    return landing_image

@router.post("/{category}/portrait/{image_id}")
async def update_landing_portrait_image(
    category: str,
    image_id: int,
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Validate category - only hero section needs portrait
    valid_categories = ["hero"]
    if category not in valid_categories:
        raise HTTPException(status_code=400, detail="Invalid category for portrait image")
    
    # Save file to S3
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{category}-portrait-{uuid4()}{file_extension}"
    portrait_image_url = await upload_file_local(file, "landing", filename)
    
    # Update specific landing image by ID
    landing_image = db.query(LandingImage).filter(
        LandingImage.id == image_id,
        LandingImage.category == category
    ).first()
    
    if not landing_image:
        raise HTTPException(status_code=404, detail="Landing image not found")
    
    # Delete old portrait image from local storage if exists
    if landing_image.portrait_image_url:
        delete_file_local(landing_image.portrait_image_url)
    
    landing_image.portrait_image_url = portrait_image_url
    
    db.commit()
    db.refresh(landing_image)
    
    return landing_image

@router.delete("/{image_id}")
async def delete_landing_image(
    image_id: int,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    landing_image = db.query(LandingImage).filter(LandingImage.id == image_id).first()
    
    if not landing_image:
        raise HTTPException(status_code=404, detail="Landing image not found")
    
    # Delete image files from local storage
    if landing_image.image_url:
        delete_file_local(landing_image.image_url)
    if landing_image.portrait_image_url:
        delete_file_local(landing_image.portrait_image_url)
    
    db.delete(landing_image)
    db.commit()
    
    return {"message": "Landing image deleted successfully"}
