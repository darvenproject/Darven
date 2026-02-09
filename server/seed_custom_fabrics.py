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
            {"name": "Gray", "code": "#8E8E8E"}, {"name": "Navy Blue", "code": "#1A2232"},
            {"name": "Dune Brown", "code": "#7A6A53"}, {"name": "Millbrook", "code": "#594433"},
            {"name": "Orient", "code": "#25465F"}, {"name": "Black", "code": "#1B1B1B"},
            {"name": "Dark Olive", "code": "#3D3F32"}, {"name": "Firefly", "code": "#0D1C2E"},
            {"name": "Silver Sand", "code": "#BFC1C2"}, {"name": "Spring Wood", "code": "#F1EBD9"},
            {"name": "Mirage", "code": "#5D5E60"}, {"name": "Cement", "code": "#A5A5A5"},
            {"name": "Dune", "code": "#A89B8C"}, {"name": "Congo Purple", "code": "#59373E"},
            {"name": "Iron Gray", "code": "#52595D"}, {"name": "Merino White", "code": "#F2F0E6"},
            {"name": "Paco Brown", "code": "#7E7166"}, {"name": "Zinc", "code": "#7D7F7D"},
            {"name": "Westar", "code": "#D5D1C9"}, {"name": "Heavy Metal", "code": "#2B3228"},
            {"name": "Timber Green", "code": "#1B302B"}, {"name": "Rangitoto", "code": "#2E332D"}
        ],
        "image_url": f"{FRONTEND_URL}/placeholder-washnwear.jpg"
    },
   {
        "name": "Soft Cotton",
        "description": "Premium soft cotton fabric with excellent breathability. Ideal for hot weather and comfortable all-day wear.",
        "price": 3000,
        "material": "Soft Cotton",
        "colors": [
            {"name": "White", "code": "#FFFFFF"}, {"name": "Black", "code": "#1B1B1B"},
            {"name": "Navy", "code": "#1A2232"}, {"name": "Gray", "code": "#8E8E8E"},
            {"name": "Spicy Mix", "code": "#8D5E4C"}, {"name": "Dune", "code": "#A89B8C"},
            {"name": "Birch", "code": "#96897B"}, {"name": "Lisbon Brown", "code": "#635447"},
            {"name": "Cedar", "code": "#3D3622"}, {"name": "Dune Brown", "code": "#7A6A53"},
            {"name": "Rangitoto", "code": "#2E332D"}, {"name": "Metallic Bronze", "code": "#4D4433"},
            {"name": "Metallic Brown", "code": "#5E503F"}, {"name": "Charade", "code": "#2D313A"},
            {"name": "Timber Green", "code": "#1B302B"}, {"name": "Mirage", "code": "#5D5E60"},
            {"name": "Paco", "code": "#7E7166"}, {"name": "Cocoa Bean", "code": "#481C14"},
            {"name": "Ironstone", "code": "#86483E"}, {"name": "Navy Tuna", "code": "#343642"},
            {"name": "Off White", "code": "#FAF9F6"}
        ],
        "image_url": f"{FRONTEND_URL}/placeholder-cotton.jpg"
    },
   {
        "name": "Giza Moon Cotton",
        "description": "Luxurious Giza Moon cotton with superior quality and comfort.",
        "price": 5000,
        "material": "Giza Moon Cotton",
        "colors": [
            {"name": "Gray", "code": "#8E8E8E"}, {"name": "White", "code": "#FFFFFF"},
            {"name": "Black", "code": "#1B1B1B"}, {"name": "Navy Blue", "code": "#1A2232"},
            {"name": "Pesto", "code": "#7C7C44"}, {"name": "Coral Reef", "code": "#F29191"},
            {"name": "Coral Tree", "code": "#A75949"}, {"name": "Maroon", "code": "#800000"},
            {"name": "Ship Cove", "code": "#788BA5"}, {"name": "Dark Yellow", "code": "#D4AF37"}
        ],
        "image_url": f"{FRONTEND_URL}/placeholder-cotton.jpg"
    },
   {
        "name": "Boski",
        "description": "Traditional Boski fabric with a premium finish.",
        "price": 4500,
        "material": "Boski",
        "colors": [
            {"name": "Gray", "code": "#8E8E8E"}, {"name": "White", "code": "#FFFFFF"},
            {"name": "Navy Blue", "code": "#1A2232"}, {"name": "Black", "code": "#1B1B1B"}
        ],
        "image_url": f"{FRONTEND_URL}/placeholder.jpg"
    },
    {
        "name": "Blended",
        "description": "Luxurious blended fabric combining comfort and style.",
        "price": 3800,
        "material": "Blended",
        "colors": [
            {"name": "Gray", "code": "#8E8E8E"}, {"name": "White", "code": "#FFFFFF"},
            {"name": "Navy Blue", "code": "#1A2232"}, {"name": "Black", "code": "#1B1B1B"}
        ],
        "image_url": f"{FRONTEND_URL}/placeholder.jpg"
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
