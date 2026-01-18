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

# Create .env content
env_content = f"""DATABASE_URL=postgresql://postgres:{postgres_password}@localhost:5432/{db_name}
SECRET_KEY=darven-secret-key-change-in-production-12345
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
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
    print()
    print("You can now run: python main.py")
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Error creating .env file: {e}")
