from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import KameezSize, ShalwarSize, Admin, SizeType
from schemas import (
    KameezSizeCreate, KameezSizeResponse,
    ShalwarSizeCreate, ShalwarSizeResponse,
    UserMeasurements, SizeRecommendation
)
from auth import get_current_admin

router = APIRouter()

# Kameez Size Endpoints
@router.get("/kameez", response_model=List[KameezSizeResponse])
async def get_kameez_sizes(db: Session = Depends(get_db)):
    """Get all Kameez sizes"""
    sizes = db.query(KameezSize).order_by(
        db.query(KameezSize).filter(KameezSize.size == SizeType.XS).exists(),
        db.query(KameezSize).filter(KameezSize.size == SizeType.S).exists(),
        db.query(KameezSize).filter(KameezSize.size == SizeType.M).exists(),
        db.query(KameezSize).filter(KameezSize.size == SizeType.L).exists(),
        db.query(KameezSize).filter(KameezSize.size == SizeType.XL).exists()
    ).all()
    return sizes

@router.get("/kameez/{size}", response_model=KameezSizeResponse)
async def get_kameez_size(size: str, db: Session = Depends(get_db)):
    """Get specific Kameez size by size code"""
    try:
        size_enum = SizeType[size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    size_data = db.query(KameezSize).filter(KameezSize.size == size_enum).first()
    if not size_data:
        raise HTTPException(status_code=404, detail="Size not found")
    return size_data

@router.post("/kameez", response_model=KameezSizeResponse)
async def create_kameez_size(
    size_data: KameezSizeCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new Kameez size (admin only)"""
    try:
        size_enum = SizeType[size_data.size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    # Check if size already exists
    existing = db.query(KameezSize).filter(KameezSize.size == size_enum).first()
    if existing:
        raise HTTPException(status_code=400, detail="Size already exists")
    
    # Validate measurements are positive
    if any(val <= 0 for val in [size_data.collar, size_data.shoulder, size_data.chest, size_data.sleeves, size_data.length]):
        raise HTTPException(status_code=400, detail="All measurements must be positive numbers")
    
    new_size = KameezSize(
        size=size_enum,
        collar=size_data.collar,
        shoulder=size_data.shoulder,
        chest=size_data.chest,
        sleeves=size_data.sleeves,
        length=size_data.length
    )
    
    db.add(new_size)
    db.commit()
    db.refresh(new_size)
    return new_size

@router.put("/kameez/{size}", response_model=KameezSizeResponse)
async def update_kameez_size(
    size: str,
    size_data: KameezSizeCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update Kameez size (admin only)"""
    try:
        size_enum = SizeType[size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    existing = db.query(KameezSize).filter(KameezSize.size == size_enum).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Size not found")
    
    # Validate measurements are positive
    if any(val <= 0 for val in [size_data.collar, size_data.shoulder, size_data.chest, size_data.sleeves, size_data.length]):
        raise HTTPException(status_code=400, detail="All measurements must be positive numbers")
    
    existing.collar = size_data.collar
    existing.shoulder = size_data.shoulder
    existing.chest = size_data.chest
    existing.sleeves = size_data.sleeves
    existing.length = size_data.length
    
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/kameez/{size}")
async def delete_kameez_size(
    size: str,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete Kameez size (admin only)"""
    try:
        size_enum = SizeType[size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    existing = db.query(KameezSize).filter(KameezSize.size == size_enum).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Size not found")
    
    db.delete(existing)
    db.commit()
    return {"message": "Size deleted successfully"}

# Shalwar Size Endpoints
@router.get("/shalwar", response_model=List[ShalwarSizeResponse])
async def get_shalwar_sizes(db: Session = Depends(get_db)):
    """Get all Shalwar sizes"""
    sizes = db.query(ShalwarSize).order_by(ShalwarSize.id).all()
    return sizes

@router.get("/shalwar/{size}", response_model=ShalwarSizeResponse)
async def get_shalwar_size(size: str, db: Session = Depends(get_db)):
    """Get specific Shalwar size by size code"""
    try:
        size_enum = SizeType[size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    size_data = db.query(ShalwarSize).filter(ShalwarSize.size == size_enum).first()
    if not size_data:
        raise HTTPException(status_code=404, detail="Size not found")
    return size_data

@router.post("/shalwar", response_model=ShalwarSizeResponse)
async def create_shalwar_size(
    size_data: ShalwarSizeCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create new Shalwar size (admin only)"""
    try:
        size_enum = SizeType[size_data.size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    # Check if size already exists
    existing = db.query(ShalwarSize).filter(ShalwarSize.size == size_enum).first()
    if existing:
        raise HTTPException(status_code=400, detail="Size already exists")
    
    # Validate measurements are positive
    if size_data.length <= 0:
        raise HTTPException(status_code=400, detail="Length must be a positive number")
    
    new_size = ShalwarSize(
        size=size_enum,
        length=size_data.length
    )
    
    db.add(new_size)
    db.commit()
    db.refresh(new_size)
    return new_size

@router.put("/shalwar/{size}", response_model=ShalwarSizeResponse)
async def update_shalwar_size(
    size: str,
    size_data: ShalwarSizeCreate,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update Shalwar size (admin only)"""
    try:
        size_enum = SizeType[size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    existing = db.query(ShalwarSize).filter(ShalwarSize.size == size_enum).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Size not found")
    
    # Validate measurements are positive
    if size_data.length <= 0:
        raise HTTPException(status_code=400, detail="Length must be a positive number")
    
    existing.length = size_data.length
    
    db.commit()
    db.refresh(existing)
    return existing

@router.delete("/shalwar/{size}")
async def delete_shalwar_size(
    size: str,
    admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete Shalwar size (admin only)"""
    try:
        size_enum = SizeType[size.upper()]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid size. Must be one of: XS, S, M, L, XL")
    
    existing = db.query(ShalwarSize).filter(ShalwarSize.size == size_enum).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Size not found")
    
    db.delete(existing)
    db.commit()
    return {"message": "Size deleted successfully"}

# Size Recommendation
@router.post("/recommend", response_model=SizeRecommendation)
async def recommend_size(
    measurements: UserMeasurements,
    db: Session = Depends(get_db)
):
    """Get size recommendation based on user measurements"""
    kameez_sizes = db.query(KameezSize).all()
    
    if not kameez_sizes:
        raise HTTPException(status_code=404, detail="No size data available")
    
    best_match = None
    best_score = float('inf')
    
    # Calculate best fit based on measurements
    for size in kameez_sizes:
        score = 0
        count = 0
        
        if measurements.collar:
            score += abs(size.collar - measurements.collar)
            count += 1
        if measurements.shoulder:
            score += abs(size.shoulder - measurements.shoulder)
            count += 1
        if measurements.chest:
            score += abs(size.chest - measurements.chest)
            count += 1
        if measurements.sleeves:
            score += abs(size.sleeves - measurements.sleeves)
            count += 1
        if measurements.length:
            score += abs(size.length - measurements.length)
            count += 1
        
        if count > 0:
            avg_score = score / count
            if avg_score < best_score:
                best_score = avg_score
                best_match = size
    
    if not best_match:
        raise HTTPException(status_code=400, detail="Please provide at least one measurement")
    
    # Determine confidence level
    if best_score < 0.5:
        confidence = "perfect"
        notes = ["This size is an excellent match for your measurements!"]
    elif best_score < 1.5:
        confidence = "good"
        notes = ["This size should fit you well.", "Minor adjustments may be needed."]
    else:
        confidence = "consider_custom"
        notes = ["Your measurements fall between standard sizes.", "Consider our custom stitching service for the perfect fit."]
    
    return {
        "recommended_size": best_match.size.value,
        "confidence": confidence,
        "measurements": {
            "collar": best_match.collar,
            "shoulder": best_match.shoulder,
            "chest": best_match.chest,
            "sleeves": best_match.sleeves,
            "length": best_match.length
        },
        "notes": notes
    }

# Utility endpoint for unit conversion
@router.get("/convert")
async def convert_units(value: float, from_unit: str, to_unit: str):
    """Convert measurements between inches and centimeters"""
    from_unit = from_unit.lower()
    to_unit = to_unit.lower()
    
    if from_unit not in ["inches", "cm", "centimeters"]:
        raise HTTPException(status_code=400, detail="from_unit must be 'inches' or 'cm'")
    if to_unit not in ["inches", "cm", "centimeters"]:
        raise HTTPException(status_code=400, detail="to_unit must be 'inches' or 'cm'")
    
    # Conversion factor: 1 inch = 2.54 cm
    if from_unit == "inches" and to_unit in ["cm", "centimeters"]:
        result = value * 2.54
    elif from_unit in ["cm", "centimeters"] and to_unit == "inches":
        result = value / 2.54
    else:
        result = value  # Same unit
    
    return {
        "original_value": value,
        "original_unit": from_unit,
        "converted_value": round(result, 2),
        "converted_unit": to_unit
    }
