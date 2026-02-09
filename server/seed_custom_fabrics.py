"""
Seed script to populate custom fabrics with colors
Run this script to add/update fabric types with their available colors
"""

from database import SessionLocal, engine, Base
from models import CustomFabric
import os

# Create database tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://shopdarven.pk").rstrip("/")

# Define fabrics with their color arrays
fabrics_data = [
    {
        "name": "Wash n Wear",
        "description": "Premium wash and wear fabric with excellent durability and easy care. Perfect for everyday wear with a crisp finish.",
        "price": 3200,
        "material": "Wash n Wear",
        "colors": [
            "Gray", "Navy Blue", "Dune Brown", "Millbrook", "Orient", "Black", 
            "Dark Olive", "Firefly", "Silver Sand", "Spring Wood", "Mirage", 
            "Cement", "Dune", "Congo Purple", "Iron Gray", "Merino White", 
            "Paco Brown", "Zinc", "Westar", "Heavy Metal", "Timber Green", 
            "Rangitoto", "Navy"
        ],
        "image_url": f"{FRONTEND_URL}/placeholder-washnwear.jpg"
    },
    {
        "name": "Blended",
        "description": "Luxurious blended fabric combining comfort and style. Ideal for both formal and casual occasions.",
        "price": 3800,
        "material": "Blended",
        "colors": [
            "Gray", "White", "Navy Blue", "Black"
        ],
        "image_url": f"{FRONTEND_URL}/placeholder.jpg"
    },
    {
        "name": "Boski",
        "description": "Traditional Boski fabric with a premium finish. Perfect for special occasions and formal events.",
        "price": 4500,
        "material": "Boski",
        "colors": [
            "Gray", "White", "Navy Blue", "Black"
        ],
        "image_url": f"{FRONTEND_URL}/placeholder.jpg"
    },
    {
        "name": "Soft Cotton",
        "description": "Premium soft cotton fabric with excellent breathability. Ideal for hot weather and comfortable all-day wear.",
        "price": 3000,
        "material": "Soft Cotton",
        "colors": [
            "White", "Black", "Navy", "Gray", "Spicy Mix", "Dune", "Birch", 
            "Lisbon Brown", "Cedar", "Dune Brown", "Rangitoto", "Metallic Bronze", 
            "Metallic Brown", "Charade", "Timber Green", "Mirage", "Paco", 
            "Cocoa Bean", "Ironstone", "Navy Tuna", "Off White"
        ],
        "image_url": f"{FRONTEND_URL}/placeholder-cotton.jpg"
    },
    {
        "name": "Giza Moon Cotton",
        "description": "Luxurious Giza Moon cotton with superior quality and comfort. Premium fabric for those who appreciate the finest.",
        "price": 5000,
        "material": "Giza Moon Cotton",
        "colors": [
            "Gray", "White", "Black", "Navy Blue", "Pesto", "Coral Reef", 
            "Coral Tree", "Maroon", "Ship Cove", "Dark Yellow"
        ],
        "image_url": f"{FRONTEND_URL}/placeholder-cotton.jpg"
    }
]

def seed_custom_fabrics():
    """Seed or update custom fabrics in the database"""
    
    print("🌱 Seeding custom fabrics with colors...")
    
    # Get list of materials we want to keep
    valid_materials = [fabric["material"] for fabric in fabrics_data]
    
    # Delete all fabrics that are NOT in our new list
    deleted_count = db.query(CustomFabric).filter(
        ~CustomFabric.material.in_(valid_materials)
    ).delete(synchronize_session=False)
    
    if deleted_count > 0:
        print(f"🗑️  Removed {deleted_count} old fabric(s) (Cotton, Lawn, Khaddar, Linen, etc.)")
    
    # Now add/update the 5 new fabrics
    for fabric_data in fabrics_data:
        # Check if fabric already exists
        existing_fabric = db.query(CustomFabric).filter(
            CustomFabric.material == fabric_data["material"]
        ).first()
        
        if existing_fabric:
            # Update existing fabric
            existing_fabric.name = fabric_data["name"]
            existing_fabric.description = fabric_data["description"]
            existing_fabric.price = fabric_data["price"]
            existing_fabric.colors = fabric_data["colors"]
            existing_fabric.image_url = fabric_data["image_url"]
            print(f"✅ Updated: {fabric_data['name']} with {len(fabric_data['colors'])} colors")
        else:
            # Create new fabric
            new_fabric = CustomFabric(
                name=fabric_data["name"],
                description=fabric_data["description"],
                price=fabric_data["price"],
                material=fabric_data["material"],
                colors=fabric_data["colors"],
                image_url=fabric_data["image_url"]
            )
            db.add(new_fabric)
            print(f"✨ Created: {fabric_data['name']} with {len(fabric_data['colors'])} colors")
    
    db.commit()
    print(f"\n✅ Successfully seeded {len(fabrics_data)} custom fabrics!")
    print("\n📋 Fabric Summary:")
    for fabric_data in fabrics_data:
        print(f"  • {fabric_data['name']}: {len(fabric_data['colors'])} colors - Rs.{fabric_data['price']}")
    
    print(f"\n🎨 Total fabrics in database: {db.query(CustomFabric).count()}")
    print("✨ Only these 5 fabric types should exist now!")

if __name__ == "__main__":
    try:
        seed_custom_fabrics()
    except Exception as e:
        print(f"❌ Error seeding fabrics: {e}")
        db.rollback()
    finally:
        db.close()
