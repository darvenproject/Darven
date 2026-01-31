# Darven - Premium Kurta Pajama & Shalwar Kameez E-Commerce Platform

A full-stack e-commerce application for selling traditional Pakistani clothing including ready-made products and custom stitching services.

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

## License

All rights reserved.
