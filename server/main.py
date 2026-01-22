from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from api import admin, landing, ready_made, fabrics, custom, orders, sizes
from database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Darven API", version="1.0.0")

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,https://shopdarven.netlify.app")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Note: For Lambda deployment, files are stored in S3, not local filesystem
# The following code is only used for local development
if os.getenv("AWS_EXECUTION_ENV") is None:  # Not running in Lambda
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("uploads/landing", exist_ok=True)
    os.makedirs("uploads/ready-made", exist_ok=True)
    os.makedirs("uploads/fabrics", exist_ok=True)
    
    # Mount static files
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(landing.router, prefix="/landing-images", tags=["landing"])
app.include_router(ready_made.router, prefix="/ready-made", tags=["ready-made"])
app.include_router(fabrics.router, prefix="/fabrics", tags=["fabrics"])
app.include_router(custom.router, prefix="/custom-fabrics", tags=["custom"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])
app.include_router(sizes.router, prefix="/sizes", tags=["sizes"])

@app.get("/")
async def root():
    return {"message": "Darven API - Premium Kurta Pajama & Shalwar Kameez"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
