# Brainstormer - Word Association Tool

A creative tool that generates diverse word associations from a single input word. Built with React, Python, and OpenAI!

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

## Rate Limiting

The API implements rate limiting to ensure fair usage and system stability:

- Default endpoints: 100 requests per minute
- Search endpoints: 20 requests per minute
- Bulk operations: 10 requests per minute

Rate limits are applied per user (if authenticated) or per IP address. When rate limit is exceeded, the API returns a 429 status code with a Retry-After header.

## Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- Redis 6+
- Supabase account
- OpenAI API key

### Environment Variables

Backend (.env):

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

Frontend (.env):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Installation

1. Backend setup:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

2. Frontend setup:

```bash
cd frontend
npm install
npm start
```

3. Redis setup:

```bash
# Install Redis
# On Windows: Use Windows Subsystem for Linux (WSL) or Docker
# On macOS: brew install redis
# On Linux: sudo apt install redis-server

# Start Redis server
redis-server
```

## API Documentation

The API documentation is available at `/api/v1/docs` when running the server.

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Rate limit errors (429) include:

- Retry-After header with seconds until reset
- JSON response with error details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
