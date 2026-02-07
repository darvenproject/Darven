from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import logging
import traceback

from api import admin, landing, ready_made, fabrics, custom, orders, sizes
from database import engine, Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {str(e)}")
    logger.error(traceback.format_exc())

app = FastAPI(title="Darven API", version="1.0.0")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(f"Request URL: {request.url}")
    logger.error(f"Request method: {request.method}")
    logger.error(traceback.format_exc())
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc),
            "path": str(request.url)
        },
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
        }
    )

# CORS middleware
# Default origins include localhost for development and production domains
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,https://shopdarven.pages.dev,https://shopdarven.pk,https://www.shopdarven.pk"
)

# Parse origins and strip whitespace
origins_list = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Create uploads directory if it doesn't exist
# Support both UPLOAD_DIR (production) and UPLOADS_DIR (local)
uploads_directory = os.getenv("UPLOAD_DIR") or os.getenv("UPLOADS_DIR", "uploads")
os.makedirs(uploads_directory, exist_ok=True)
os.makedirs(os.path.join(uploads_directory, "landing"), exist_ok=True)
os.makedirs(os.path.join(uploads_directory, "ready-made"), exist_ok=True)
os.makedirs(os.path.join(uploads_directory, "fabrics"), exist_ok=True)
os.makedirs(os.path.join(uploads_directory, "custom-fabrics"), exist_ok=True)

# Mount static files
# Mount at both /uploads and /static/uploads for compatibility
app.mount("/uploads", StaticFiles(directory=uploads_directory), name="uploads")
# Also mount at /static/uploads for production nginx setup
try:
    app.mount("/static/uploads", StaticFiles(directory=uploads_directory), name="static_uploads")
except Exception:
    pass  # If already mounted, skip

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

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle OPTIONS requests for CORS preflight"""
    return {"message": "OK"}
