"""
Seed script to populate size chart data for Kameez and Shalwar
Run this script once after creating the database tables
"""

from database import SessionLocal, engine, Base
from models import KameezSize, ShalwarSize, SizeType

def seed_sizes():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_kameez = db.query(KameezSize).count()
        existing_shalwar = db.query(ShalwarSize).count()
        
        if existing_kameez > 0 or existing_shalwar > 0:
            print("Size data already exists. Skipping seed.")
            return
        
        # Kameez size data
        kameez_data = [
            {"size": SizeType.XS, "collar": 14.5, "shoulder": 17, "chest": 22, "sleeves": 23, "length": 39},
            {"size": SizeType.S, "collar": 15, "shoulder": 17.5, "chest": 23, "sleeves": 23.5, "length": 40},
            {"size": SizeType.M, "collar": 16, "shoulder": 18.5, "chest": 24, "sleeves": 24.25, "length": 42},
            {"size": SizeType.L, "collar": 17, "shoulder": 19.5, "chest": 25, "sleeves": 25, "length": 43},
            {"size": SizeType.XL, "collar": 18, "shoulder": 20.5, "chest": 27, "sleeves": 25.5, "length": 44},
        ]
        
        # Shalwar size data
        shalwar_data = [
            {"size": SizeType.XS, "length": 39},
            {"size": SizeType.S, "length": 40},
            {"size": SizeType.M, "length": 42},
            {"size": SizeType.L, "length": 43},
            {"size": SizeType.XL, "length": 44},
        ]
        
        # Add Kameez sizes
        for data in kameez_data:
            kameez_size = KameezSize(**data)
            db.add(kameez_size)
        
        # Add Shalwar sizes
        for data in shalwar_data:
            shalwar_size = ShalwarSize(**data)
            db.add(shalwar_size)
        
        db.commit()
        print("✅ Size data seeded successfully!")
        print(f"   - Added {len(kameez_data)} Kameez sizes")
        print(f"   - Added {len(shalwar_data)} Shalwar sizes")
        
    except Exception as e:
        print(f"❌ Error seeding sizes: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    print("Seeding size data...")
    seed_sizes()
