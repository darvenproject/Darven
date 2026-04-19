"""
Helper script to create .env file
Run this script and enter your PostgreSQL password when prompted
"""

import os

print("=" * 60)
print("Darven - Environment File Setup")
print("=" * 60)
print()

# Get PostgreSQL password from user
postgres_password = input("Enter your PostgreSQL password: ")

# Get database name
db_name = input("Enter database name (default: darvin_db): ").strip()
if not db_name:
    db_name = "darvin_db"

# Get deployment type
print()
print("Select deployment type:")
print("1. Production (shopdarven.pk)")
print("2. Local development")
deployment_type = input("Enter choice (1 or 2, default: 2): ").strip()

if deployment_type == "1":
    # Production setup
    allowed_origins = "https://shopdarven.pk,https://api.shopdarven.pk"
    upload_dir = "/var/www/darven/server/static/uploads"
    base_image_url = "https://api.shopdarven.pk/static/uploads"
else:
    # Local development setup
    allowed_origins = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"
    upload_dir = "uploads"
    base_image_url = "http://localhost:8000/uploads"

# Create .env content
env_content = f"""DATABASE_URL=postgresql://postgres:{postgres_password}@localhost:5432/{db_name}
SECRET_KEY=darven-secret-key-change-in-production-12345
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ALLOWED_ORIGINS={allowed_origins}
UPLOAD_DIR={upload_dir}
MAX_UPLOAD_SIZE=10485760
BASE_IMAGE_URL={base_image_url}
"""

# Write to .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')

try:
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print()
    print("✅ SUCCESS!")
    print(f"✅ .env file created at: {env_path}")
    print()
    print("Your configuration:")
    print(f"  - Database: {db_name}")
    print(f"  - Host: localhost:5432")
    print(f"  - User: postgres")
    print(f"  - Allowed Origins: {allowed_origins}")
    print(f"  - Upload Directory: {upload_dir}")
    print(f"  - Base Image URL: {base_image_url}")
    print()
    print("⚠️  IMPORTANT: After updating .env, restart your server!")
    print("   For production: sudo systemctl restart darven-api")
    print("   For local: Stop and restart 'python main.py'")
    print()
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Error creating .env file: {e}")
