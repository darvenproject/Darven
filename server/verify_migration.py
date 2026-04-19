from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'fabrics' AND column_name = 'colors'"))
    fabrics = result.fetchone()
    print('Fabrics colors column:', fabrics if fabrics else 'NOT FOUND')
    
    result = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ready_made_products' AND column_name = 'colors'"))
    products = result.fetchone()
    print('Products colors column:', products if products else 'NOT FOUND')
    
    result = conn.execute(text('SELECT COUNT(*) FROM fabrics'))
    print('Total fabrics:', result.fetchone()[0])
    
    result = conn.execute(text('SELECT COUNT(*) FROM ready_made_products'))
    print('Total products:', result.fetchone()[0])
