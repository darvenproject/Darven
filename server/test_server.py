"""
Simple test to check if the server can start
"""
import sys

print("=" * 60)
print("Testing Darven Backend Server")
print("=" * 60)

try:
    print("\n1. Checking Python version...")
    print(f"   Python {sys.version}")
    
    print("\n2. Importing required modules...")
    import fastapi
    print(f"   ✓ FastAPI version: {fastapi.__version__}")
    
    import uvicorn
    print(f"   ✓ Uvicorn installed")
    
    import sqlalchemy
    print(f"   ✓ SQLAlchemy version: {sqlalchemy.__version__}")
    
    import psycopg2
    print(f"   ✓ psycopg2 installed")
    
    print("\n3. Checking .env file...")
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        # Hide password
        safe_url = db_url.split('@')[0].split(':')[:-1]
        print(f"   ✓ DATABASE_URL is set")
        print(f"   Database: {db_url.split('/')[-1]}")
    else:
        print("   ✗ DATABASE_URL not found in .env")
        print("   Please create .env file with DATABASE_URL")
        sys.exit(1)
    
    print("\n4. Testing database connection...")
    from database import engine
    with engine.connect() as conn:
        print("   ✓ Database connection successful!")
    
    print("\n5. Testing FastAPI app...")
    from main import app
    print("   ✓ FastAPI app loaded successfully")
    
    print("\n" + "=" * 60)
    print("✅ ALL CHECKS PASSED!")
    print("=" * 60)
    print("\nYou can now start the server with:")
    print("  python run.py")
    print("\nOr:")
    print("  uvicorn main:app --reload --port 8000")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nPlease fix the error above before starting the server.")
    import traceback
    traceback.print_exc()
    sys.exit(1)
