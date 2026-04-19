import os
import aiofiles
from uuid import uuid4
from typing import Optional
from fastapi import UploadFile
from dotenv import load_dotenv

load_dotenv()

# Local file storage configuration
# Support both UPLOAD_DIR (production) and UPLOADS_DIR (local)
UPLOADS_DIR = os.getenv("UPLOAD_DIR") or os.getenv("UPLOADS_DIR", "uploads")
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")


def get_file_url(path: str) -> str:
    """Generate public URL for uploaded file"""
    return f"{BASE_URL}/{path}"


async def upload_file_local(
    file: UploadFile,
    folder: str,
    filename: Optional[str] = None
) -> str:
    """
    Upload file to local filesystem
    
    Args:
        file: UploadFile object from FastAPI
        folder: Folder path in uploads directory (e.g., 'landing', 'ready-made', 'fabrics')
        filename: Optional custom filename, if not provided will generate UUID
        
    Returns:
        str: Public URL of uploaded file
    """
    # Generate unique filename if not provided
    if not filename:
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
    
    # Create folder if it doesn't exist
    folder_path = os.path.join(UPLOADS_DIR, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    # Construct file path
    file_path = os.path.join(folder_path, filename)
    
    try:
        # Read and save file content
        file_content = await file.read()
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        # Reset file pointer for potential reuse
        await file.seek(0)
        
        # Return URL path (relative to server)
        return get_file_url(f"uploads/{folder}/{filename}")
    
    except Exception as e:
        raise Exception(f"Failed to upload file: {str(e)}")


def delete_file_local(file_url: str) -> bool:
    """
    Delete file from local filesystem
    
    Args:
        file_url: Full URL or relative path to file
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Extract relative path from URL if full URL is provided
        if file_url.startswith('http'):
            # Extract path from URL: http://domain/uploads/folder/file.jpg
            path_parts = file_url.split('/uploads/')
            if len(path_parts) > 1:
                relative_path = path_parts[1]
            else:
                return False
        else:
            # Remove leading slash and 'uploads/' if present
            relative_path = file_url.lstrip('/').replace('uploads/', '', 1)
        
        # Construct full file path
        file_path = os.path.join(UPLOADS_DIR, relative_path)
        
        # Delete file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        
        return False
    
    except Exception as e:
        print(f"Failed to delete file: {str(e)}")
        return False


def delete_multiple_files_local(file_urls: list) -> bool:
    """
    Delete multiple files from local filesystem
    
    Args:
        file_urls: List of URLs or relative paths
        
    Returns:
        bool: True if all successful, False otherwise
    """
    if not file_urls:
        return False
    
    success = True
    for url in file_urls:
        if not delete_file_local(url):
            success = False
    
    return success
