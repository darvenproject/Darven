# Darven - Premium Kurta Pajama & Shalwar Kameez E-Commerce Platform

A full-stack e-commerce application for selling traditional Pakistani clothing including ready-made products and custom stitching services.

## 🚀 New! SEO Optimized & Cloudflare Ready

**Just updated with comprehensive SEO optimization and Cloudflare Pages support!**

👉 **[START HERE - Quick Setup Guide](START_HERE.md)** 👈

### What's New:
✅ Favicon/browser tab icon with Darven logo
✅ Complete SEO optimization for Google & search engines
✅ Social media sharing previews (Open Graph, Twitter Cards)
✅ Automatic sitemap generation
✅ Migrated from Netlify to Cloudflare Pages
✅ Progressive Web App (PWA) support

**Documentation:**
- [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md) - 📋 **Quick deployment settings**
- [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) - Complete deployment guide
- [CLOUDFLARE_FIX.md](CLOUDFLARE_FIX.md) - Deployment troubleshooting
- [FAVICON_UPDATE.md](FAVICON_UPDATE.md) - Favicon integration details

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Uvicorn** - ASGI server

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Cloudflare Pages** - Hosting and deployment

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Update the `.env` file with your database credentials and configuration.

6. Run database migrations (if using Alembic):
```bash
alembic upgrade head
```

7. Start the development server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
.
├── server/              # Backend (FastAPI)
│   ├── api/            # API routes
│   ├── models.py       # Database models
│   ├── schemas.py      # Pydantic schemas
│   ├── auth.py         # Authentication logic
│   ├── database.py     # Database configuration
│   ├── file_utils.py   # File upload utilities
│   └── main.py         # Application entry point
│
└── client/             # Frontend (Next.js)
    ├── app/            # App router pages
    ├── components/     # React components
    ├── lib/            # Utilities
    └── store/          # State management
```

## Features

- **Ready-Made Products**: Browse and purchase pre-made kurta pajamas and shalwar kameez
- **Custom Stitching**: Select fabric and provide measurements for custom-tailored clothing
- **Fabric Selection**: Browse available fabrics for custom orders
- **Admin Dashboard**: Manage products, fabrics, orders, and landing page content
- **Shopping Cart**: Add items and manage cart
- **Order Management**: Track and manage customer orders

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Deployment

### Frontend (Cloudflare Pages)

See [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) for detailed deployment instructions.

Quick start:
1. Remove Netlify dependencies: `cd client && npm install`
2. Push changes to your Git repository
3. Connect repository to Cloudflare Pages
4. Configure build settings and environment variables
5. Deploy

### Backend

Deploy your FastAPI backend to your preferred hosting service and ensure:
- CORS is configured to allow your Cloudflare Pages domain
- Environment variables are properly set
- Database is accessible

## License

All rights reserved.
