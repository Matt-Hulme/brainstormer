from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .supabase import supabase
from .config import get_settings
import uuid
from datetime import datetime, timedelta
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()
security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Verify JWT_SECRET is set
if not settings.JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is not set")


class Token(BaseModel):
    access_token: str
    token_type: str
    anonymous_id: str

class User(BaseModel):
    username: str
    anonymous_id: str
    disabled: Optional[bool] = None

# Get guest credentials from environment
GUEST_USERNAME = settings.GUEST_USERNAME
GUEST_PASSWORD = settings.GUEST_PASSWORD

def get_user(username: str):
    """Get user by username"""
    if username == GUEST_USERNAME:
        # Generate a unique anonymous ID for each login session
        unique_anonymous_id = str(uuid.uuid4())
        return {
            "username": GUEST_USERNAME,
            "anonymous_id": unique_anonymous_id,  # Use unique UUID for each session
            "disabled": False
        }
    return None

def authenticate_user(username: str, password: str):
    """Authenticate a user"""
    user = get_user(username)
    if not user:
        return False
    
    if password != GUEST_PASSWORD:
        return False
    
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        username: str = payload.get("sub")
        anonymous_id: str = payload.get("anonymous_id")
        if username is None or anonymous_id is None:
            raise credentials_exception
        user = get_user(username)
        if user is None:
            raise credentials_exception
        return user
    except JWTError:
        raise credentials_exception

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def verify_user_auth(request: Request) -> str:
    """
    Middleware to verify user authentication and return anonymous ID.
    """
    try:
        auth = await security(request)
        payload = jwt.decode(auth.credentials, settings.JWT_SECRET, algorithms=["HS256"])
        anonymous_id = payload.get("anonymous_id")
        if not anonymous_id:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return anonymous_id
    except JWTError as e:
        if "Signature has expired" in str(e):
            logger.error(f"Token expired for request: {request.url.path}")
            raise HTTPException(status_code=401, detail="Token expired. Please log in again.")
        else:
            logger.error(f"JWT error: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token. Please log in again.")
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed. Please log in again.") 