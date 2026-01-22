import boto3
import os
from uuid import uuid4
from typing import Optional
from fastapi import UploadFile
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

# AWS S3 Configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# Initialize S3 client
s3_client = boto3.client(
    's3',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
) if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY else boto3.client('s3', region_name=AWS_REGION)


def get_s3_url(key: str) -> str:
    """Generate public URL for S3 object"""
    if not S3_BUCKET_NAME:
        raise ValueError("S3_BUCKET_NAME environment variable is not set")
    return f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{key}"


async def upload_file_to_s3(
    file: UploadFile,
    folder: str,
    filename: Optional[str] = None
) -> str:
    """
    Upload file to S3 bucket
    
    Args:
        file: UploadFile object from FastAPI
        folder: Folder path in S3 bucket (e.g., 'landing', 'ready-made', 'fabrics')
        filename: Optional custom filename, if not provided will generate UUID
        
    Returns:
        str: Public URL of uploaded file
    """
    if not S3_BUCKET_NAME:
        raise ValueError("S3_BUCKET_NAME environment variable is not set")
    
    # Generate unique filename if not provided
    if not filename:
        file_extension = os.path.splitext(file.filename)[1]
        filename = f"{uuid4()}{file_extension}"
    
    # Construct S3 key
    s3_key = f"{folder}/{filename}"
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to S3
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=file.content_type or 'application/octet-stream',
            ACL='public-read'  # Make file publicly accessible
        )
        
        # Reset file pointer for potential reuse
        await file.seek(0)
        
        return get_s3_url(s3_key)
    
    except ClientError as e:
        raise Exception(f"Failed to upload file to S3: {str(e)}")


def delete_file_from_s3(file_url: str) -> bool:
    """
    Delete file from S3 bucket
    
    Args:
        file_url: Full S3 URL or S3 key
        
    Returns:
        bool: True if successful, False otherwise
    """
    if not S3_BUCKET_NAME:
        return False
    
    try:
        # Extract S3 key from URL if full URL is provided
        if file_url.startswith('http'):
            # Extract key from URL: https://bucket.s3.region.amazonaws.com/key
            s3_key = file_url.split(f"{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/")[-1]
        else:
            # Assume it's already a key, remove leading slash if present
            s3_key = file_url.lstrip('/')
        
        s3_client.delete_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key
        )
        return True
    
    except ClientError as e:
        print(f"Failed to delete file from S3: {str(e)}")
        return False


def delete_multiple_files_from_s3(file_urls: list) -> bool:
    """
    Delete multiple files from S3 bucket
    
    Args:
        file_urls: List of S3 URLs or keys
        
    Returns:
        bool: True if all successful, False otherwise
    """
    if not S3_BUCKET_NAME or not file_urls:
        return False
    
    try:
        # Prepare objects for deletion
        objects = []
        for url in file_urls:
            if url.startswith('http'):
                s3_key = url.split(f"{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/")[-1]
            else:
                s3_key = url.lstrip('/')
            objects.append({'Key': s3_key})
        
        # Delete objects
        if objects:
            s3_client.delete_objects(
                Bucket=S3_BUCKET_NAME,
                Delete={'Objects': objects}
            )
        return True
    
    except ClientError as e:
        print(f"Failed to delete multiple files from S3: {str(e)}")
        return False
