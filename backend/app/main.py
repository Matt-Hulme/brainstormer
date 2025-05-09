from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .core.auth import verify_anonymous_user
from .routes import projects, collections, saved_words, search

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    """
    Middleware to handle anonymous authentication for all requests.
    """
    # Get or create anonymous user
    user_id = await verify_anonymous_user(request)
    
    # Add user_id to request state for use in route handlers
    request.state.user_id = user_id
    
    # Process the request
    response = await call_next(request)
    return response

# Include routers
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(collections.router, prefix=settings.API_V1_STR)
app.include_router(saved_words.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Brainstormer API"} 