from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .core.auth import verify_anonymous_user
from .core.rate_limit import rate_limit_middleware, RATE_LIMITS
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
async def auth_and_rate_limit_middleware(request: Request, call_next):
    """
    Middleware to handle anonymous authentication and rate limiting for all requests.
    """
    # Get or create anonymous user
    user_id = await verify_anonymous_user(request)
    request.state.user_id = user_id
    
    # Apply rate limiting based on endpoint type
    path = request.url.path
    if "/search" in path:
        limiter = RATE_LIMITS["search"]
    elif "/bulk" in path:
        limiter = RATE_LIMITS["bulk"]
    else:
        limiter = RATE_LIMITS["default"]
    
    return await rate_limit_middleware(request, call_next, limiter)

# Include routers
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(collections.router, prefix=settings.API_V1_STR)
app.include_router(saved_words.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to Brainstormer API"} 