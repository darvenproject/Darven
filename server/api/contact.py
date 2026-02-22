from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str

def send_email(contact_data: ContactRequest):
    """Send email using SMTP"""
    try:
        # Email configuration from environment variables
        smtp_server = os.getenv("SMTP_HOST", os.getenv("SMTP_SERVER", "smtp.gmail.com"))
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        sender_email = os.getenv("SMTP_USER", os.getenv("SMTP_EMAIL"))
        sender_password = os.getenv("SMTP_PASSWORD")
        recipient_email = os.getenv("EMAIL_TO", "shopdarven@gmail.com")
        
        if not sender_email or not sender_password:
            logger.error("SMTP credentials not configured")
            raise HTTPException(
                status_code=500,
                detail="Email service not configured. Please contact administrator."
            )
        
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"New Contact Form Submission from {contact_data.name}"
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Reply-To"] = contact_data.email
        
        # Create HTML email body
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="margin: 20px 0;">
                        <p style="margin: 10px 0;">
                            <strong style="display: inline-block; width: 100px;">Name:</strong>
                            {contact_data.name}
                        </p>
                        <p style="margin: 10px 0;">
                            <strong style="display: inline-block; width: 100px;">Email:</strong>
                            <a href="mailto:{contact_data.email}" style="color: #0066cc;">
                                {contact_data.email}
                            </a>
                        </p>
                        <p style="margin: 10px 0;">
                            <strong style="display: inline-block; width: 100px;">Phone:</strong>
                            <a href="tel:{contact_data.phone}" style="color: #0066cc;">
                                {contact_data.phone}
                            </a>
                        </p>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
                        <strong style="display: block; margin-bottom: 10px;">Message:</strong>
                        <p style="margin: 0; white-space: pre-wrap;">{contact_data.message}</p>
                    </div>
                    
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                        <p>This email was sent from the ShopDarven contact form.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Create plain text version
        text_body = f"""
New Contact Form Submission

Name: {contact_data.name}
Email: {contact_data.email}
Phone: {contact_data.phone}

Message:
{contact_data.message}

---
This email was sent from the ShopDarven contact form.
        """
        
        # Attach both versions
        part1 = MIMEText(text_body, "plain")
        part2 = MIMEText(html_body, "html")
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        logger.info(f"Attempting to send email via {smtp_server}:{smtp_port}")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            logger.info(f"Contact form email sent successfully from {contact_data.email}")
        
        return True
        
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error sending email: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while sending your message: {str(e)}"
        )

@router.post("/contact")
async def submit_contact_form(contact_data: ContactRequest):
    """Handle contact form submission"""
    try:
        # Validate data
        if not contact_data.name or len(contact_data.name.strip()) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
        
        if not contact_data.phone or len(contact_data.phone.strip()) < 10:
            raise HTTPException(status_code=400, detail="Please provide a valid phone number")
        
        if not contact_data.message or len(contact_data.message.strip()) < 10:
            raise HTTPException(status_code=400, detail="Message must be at least 10 characters")
        
        # Send email
        send_email(contact_data)
        
        return {
            "success": True,
            "message": "Thank you for contacting us! We will get back to you soon."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )
