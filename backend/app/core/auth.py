from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .supabase import supabase
from .config import get_settings
import uuid

settings = get_settings()
security = HTTPBearer()

async def get_anonymous_user_id(request: Request) -> str:
    """
    Gets or creates an anonymous user ID from the request.
    If no user ID is provided, creates a new anonymous user.
    """
    try:
        # Try to get the user ID from the Authorization header
        auth = await security(request)
        user_id = auth.credentials
        
        # Verify the user exists in Supabase
        response = supabase.auth.get_user(user_id)
        if response.user:
            return user_id
            
    except HTTPException:
        # If no valid auth header, create new anonymous user
        pass
    
    # Create new anonymous user
    anonymous_id = f"{settings.ANONYMOUS_USER_PREFIX}{str(uuid.uuid4())}"
    
    # Create user in Supabase
    try:
        response = supabase.auth.admin.create_user({
            "email": f"{anonymous_id}@anonymous.brainstormer",
            "password": str(uuid.uuid4()),
            "user_metadata": {"is_anonymous": True}
        })
        return response.user.id
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create anonymous user")

async def verify_anonymous_user(request: Request) -> str:
    """
    Middleware to verify and get the anonymous user ID.
    """
    return await get_anonymous_user_id(request) 