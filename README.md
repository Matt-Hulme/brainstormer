# Brainstormer - Word Association Tool

A creative tool that generates diverse word associations from a single input word. Built with React, Python, and OpenAI.

## Project Structure

- `frontend/` - React TypeScript application
- `backend/` - Python FastAPI server
- `docker/` - Docker configuration files

## Getting Started

1. Clone the repository
2. Set up environment variables
3. Run the development servers:

   ```bash
   # Frontend
   cd frontend
   npm install
   npm start

   # Backend
   cd backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

## Development

- Frontend runs on http://localhost:3000
- Backend API runs on http://localhost:8000
- API documentation available at http://localhost:8000/docs
