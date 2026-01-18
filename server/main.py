from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from api import admin, landing, ready_made, fabrics, custom, orders
from database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Darven API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

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

@app.get("/")
async def root():
    return {"message": "Darven API - Premium Kurta Pajama & Shalwar Kameez"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
