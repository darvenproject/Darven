"""
Database Migration: Add colors column to fabrics and ready_made_products tables
Run this script to add the colors column to existing tables
"""

from sqlalchemy import text
from database import engine

def run_migration():
    print("=" * 60)
    print("Database Migration: Adding colors column")
    print("=" * 60)
    print()
    
    with engine.connect() as connection:
        # Add colors column to fabrics table
        print("1. Adding colors column to fabrics table...")
        try:
            connection.execute(text(
                "ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS colors JSON"
            ))
            connection.commit()
            print("   ✓ Successfully added colors column to fabrics table")
        except Exception as e:
            print(f"   ⚠ Warning: {e}")
            print("   (This is okay if the column already exists)")
        
        print()
        
        # Update ready_made_products table: rename color to colors and change type
        print("2. Updating ready_made_products table...")
        try:
            # Check if 'color' column exists
            result = connection.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = 'ready_made_products' AND column_name = 'color'"
            ))
            has_old_column = result.fetchone() is not None
            
            if has_old_column:
                print("   - Found old 'color' column, migrating data...")
                
                # Add new colors column
                connection.execute(text(
                    "ALTER TABLE ready_made_products ADD COLUMN IF NOT EXISTS colors JSON"
                ))
                connection.commit()
                
                # Migrate data from color to colors (convert string to JSON array)
                connection.execute(text(
                    "UPDATE ready_made_products "
                    "SET colors = CASE "
                    "  WHEN color IS NOT NULL AND color != '' THEN jsonb_build_array(color) "
                    "  ELSE NULL "
                    "END "
                    "WHERE colors IS NULL"
                ))
                connection.commit()
                
                # Drop old color column
                connection.execute(text(
                    "ALTER TABLE ready_made_products DROP COLUMN IF EXISTS color"
                ))
                connection.commit()
                
                print("   ✓ Successfully migrated color -> colors")
            else:
                # Just add colors column if it doesn't exist
                connection.execute(text(
                    "ALTER TABLE ready_made_products ADD COLUMN IF NOT EXISTS colors JSON"
                ))
                connection.commit()
                print("   ✓ Added colors column to ready_made_products table")
                
        except Exception as e:
            print(f"   ✗ Error: {e}")
            raise
        
        print()
        
        # Verify changes
        print("3. Verifying changes...")
        
        # Check fabrics table
        result = connection.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'fabrics' AND column_name = 'colors'"
        ))
        fabric_colors = result.fetchone()
        if fabric_colors:
            print(f"   ✓ fabrics.colors: {fabric_colors[1]}")
        else:
            print("   ✗ fabrics.colors: NOT FOUND")
        
        # Check ready_made_products table
        result = connection.execute(text(
            "SELECT column_name, data_type FROM information_schema.columns "
            "WHERE table_name = 'ready_made_products' AND column_name = 'colors'"
        ))
        product_colors = result.fetchone()
        if product_colors:
            print(f"   ✓ ready_made_products.colors: {product_colors[1]}")
        else:
            print("   ✗ ready_made_products.colors: NOT FOUND")
        
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
