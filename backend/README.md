# Brainstormer Backend

This is the backend service for the Brainstormer application, built with FastAPI and Supabase.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A Supabase project (for database)

## Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Running the Server

### Development Mode
```bash
uvicorn app.main:app --reload --port 8000
```

The server will start at `http://localhost:8000`

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/                    # Main application code
│   ├── main.py            # Application entry point
│   ├── routes/            # API routes
│   └── core/              # Core functionality
├── sql/                   # SQL migrations and queries
├── requirements.txt       # Python dependencies
└── Dockerfile            # Docker configuration
```

## Development

- The server will automatically reload when you make changes to the code
- Use the `/docs` endpoint to test API endpoints
- Check the logs for any errors or debugging information 