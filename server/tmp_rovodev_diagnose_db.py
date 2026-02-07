"""
Database Connection Diagnostic Script
Run this to check if the database connection is working
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("Database Connection Diagnostic")
print("=" * 60)
print()

# Check environment variables
print("1. Checking environment variables...")
db_url = os.getenv("DATABASE_URL")
if db_url:
    # Mask password for security
    if "@" in db_url:
        parts = db_url.split("@")
        user_part = parts[0].split("://")[1].split(":")[0]
        masked_url = db_url.replace(parts[0].split(":")[2], "****")
        print(f"   ✓ DATABASE_URL is set: {masked_url}")
    else:
        print(f"   ✓ DATABASE_URL is set")
else:
    print("   ✗ DATABASE_URL is not set!")
    print("   Using default: postgresql://postgres:password@localhost:5432/darven")

print()

# Try to import SQLAlchemy
print("2. Checking SQLAlchemy installation...")
try:
    import sqlalchemy
    print(f"   ✓ SQLAlchemy version: {sqlalchemy.__version__}")
except ImportError as e:
    print(f"   ✗ SQLAlchemy not installed: {e}")
    exit(1)

print()

# Try to create engine
print("3. Creating database engine...")
try:
    from database import engine
    print("   ✓ Database engine created successfully")
except Exception as e:
    print(f"   ✗ Failed to create database engine: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

print()

# Try to connect to database
print("4. Testing database connection...")
try:
    connection = engine.connect()
    print("   ✓ Database connection successful!")
    connection.close()
except Exception as e:
    print(f"   ✗ Database connection failed: {e}")
    import traceback
    traceback.print_exc()
    print()
    print("   Common causes:")
    print("   - PostgreSQL server is not running")
    print("   - Wrong database credentials in .env file")
    print("   - Database does not exist")
    print("   - Network/firewall issues")
    exit(1)

print()

# Try to query tables
print("5. Checking database tables...")
try:
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    if tables:
        print(f"   ✓ Found {len(tables)} tables:")
        for table in tables:
            print(f"     - {table}")
    else:
        print("   ⚠ No tables found in database")
        print("   Run: python -c \"from database import Base, engine; Base.metadata.create_all(engine)\"")
except Exception as e:
    print(f"   ✗ Failed to check tables: {e}")
    import traceback
    traceback.print_exc()

print()

# Try to query fabrics
print("6. Testing Fabric model query...")
try:
    from database import SessionLocal
    from models import Fabric
    
    db = SessionLocal()
    fabrics = db.query(Fabric).all()
    print(f"   ✓ Successfully queried fabrics table")
    print(f"   Found {len(fabrics)} fabrics in database")
    
    if fabrics:
        print("   Sample fabric:")
        fabric = fabrics[0]
        print(f"     - ID: {fabric.id}")
        print(f"     - Name: {fabric.name}")
        print(f"     - Price: {fabric.price_per_meter}")
    
    db.close()
except Exception as e:
    print(f"   ✗ Failed to query fabrics: {e}")
    import traceback
    traceback.print_exc()

print()
print("=" * 60)
print("Diagnostic complete!")
print("=" * 60)
print()
print("If all tests passed, the database is working correctly.")
print("The 500 error might be caused by something else.")
print()
print("Next steps:")
print("1. Check server logs: sudo journalctl -u darven-api -n 100")
print("2. Restart the server: sudo systemctl restart darven-api")
print("3. Test the API endpoint directly:")
print("   curl -v https://api.shopdarven.pk/fabrics")
