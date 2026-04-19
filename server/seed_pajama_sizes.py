"""
Seed script to populate pajama size chart data
Run this script to add pajama sizes to the database
"""

from database import SessionLocal, engine, Base
from models import PajamaSize, SizeType

def seed_pajama_sizes():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_pajama = db.query(PajamaSize).count()
        
        if existing_pajama > 0:
            print("Pajama size data already exists. Skipping seed.")
            return
        
        # Pajama size data based on your requirements
        # US Size: XS, S, M, L, XL
        # Length (Inches): 37.0, 38.0, 39.0, 40.0, 41.0
        # Waist (Inches): 27.0, 29.0, 31.0, 33.0, 34.0
        # Hips (Inches): 38.0, 39.0, 40.0, 42.0, 44.0
        
        pajama_data = [
            {"size": SizeType.XS, "length": 37.0, "waist": 27.0, "hips": 38.0},
            {"size": SizeType.S, "length": 38.0, "waist": 29.0, "hips": 39.0},
            {"size": SizeType.M, "length": 39.0, "waist": 31.0, "hips": 40.0},
            {"size": SizeType.L, "length": 40.0, "waist": 33.0, "hips": 42.0},
            {"size": SizeType.XL, "length": 41.0, "waist": 34.0, "hips": 44.0},
        ]
        
        # Add Pajama sizes
        for data in pajama_data:
            pajama_size = PajamaSize(**data)
            db.add(pajama_size)
        
        db.commit()
        print("✅ Pajama size data seeded successfully!")
        print(f"   - Added {len(pajama_data)} Pajama sizes")
        
    except Exception as e:
        print(f"❌ Error seeding pajama sizes: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    print("Seeding pajama size data...")
    seed_pajama_sizes()
