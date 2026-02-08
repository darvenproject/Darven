"""
Database Migration: Add fabric_category column to fabrics and ready_made_products tables
Run this script to add the fabric_category column to existing tables
"""

from sqlalchemy import text
from database import engine

def run_migration():
    print("=" * 60)
    print("Database Migration: Adding fabric_category column")
    print("=" * 60)
    print()
    
    with engine.connect() as connection:
        # Add fabric_category column to fabrics table
        print("1. Adding fabric_category column to fabrics table...")
        try:
            connection.execute(text(
                "ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS fabric_category VARCHAR"
            ))
            connection.commit()
            print("   ✓ Successfully added fabric_category column to fabrics table")
        except Exception as e:
            print(f"   ⚠ Warning: {e}")
            print("   (This is okay if the column already exists)")
        
        print()
        
        # Add fabric_category column to ready_made_products table
        print("2. Adding fabric_category column to ready_made_products table...")
        try:
            connection.execute(text(
                "ALTER TABLE ready_made_products ADD COLUMN IF NOT EXISTS fabric_category VARCHAR"
            ))
            connection.commit()
            print("   ✓ Successfully added fabric_category column to ready_made_products table")
        except Exception as e:
            print(f"   ⚠ Warning: {e}")
            print("   (This is okay if the column already exists)")
        
        print()
        
        # Verify changes
        print("3. Verifying changes...")
        
        # Check fabrics table
        result = connection.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'fabrics' AND column_name = 'fabric_category'"
        ))
        fabric_category = result.fetchone()
        if fabric_category:
            print(f"   ✓ fabrics.fabric_category: {fabric_category[1]}")
        else:
            print("   ✗ fabrics.fabric_category: NOT FOUND")
        
        # Check ready_made_products table
        result = connection.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'ready_made_products' AND column_name = 'fabric_category'"
        ))
        product_category = result.fetchone()
        if product_category:
            print(f"   ✓ ready_made_products.fabric_category: {product_category[1]}")
        else:
            print("   ✗ ready_made_products.fabric_category: NOT FOUND")
        
        print()
        print("=" * 60)
        print("Migration completed successfully!")
        print("=" * 60)

if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print()
        print("=" * 60)
        print("Migration failed!")
        print("=" * 60)
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
