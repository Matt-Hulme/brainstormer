from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from .core.config import get_settings
from .core.auth import (
    Token,
    authenticate_user,
    create_access_token,
    verify_user_auth,
    get_current_active_user
)
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

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "anonymous_id": user.anonymous_id},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "anonymous_id": user.anonymous_id
    }

@app.middleware("http")
async def auth_and_rate_limit_middleware(request: Request, call_next):
    """
    Middleware to handle authentication and rate limiting for all requests.
    """
    # Skip auth for login endpoint
    if request.url.path == "/token":
        return await call_next(request)
        
    # Verify auth and get anonymous ID
    try:
        anonymous_id = await verify_user_auth(request)
        request.state.user_id = anonymous_id
    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code,
            content={"detail": e.detail}
        )
    
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