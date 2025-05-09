from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable, Dict, Optional
import time
import redis
from .config import get_settings

settings = get_settings()

# Initialize Redis client
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
    decode_responses=True
)

class RateLimiter:
    def __init__(
        self,
        times: int = 100,  # Number of requests allowed
        seconds: int = 60,  # Time window in seconds
        key_prefix: str = "rate_limit"
    ):
        self.times = times
        self.seconds = seconds
        self.key_prefix = key_prefix

    def _get_key(self, request: Request) -> str:
        """Generate a unique key for rate limiting based on user ID or IP."""
        # Use user_id if available, otherwise fall back to IP
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"{self.key_prefix}:{user_id}"
        
        # Fall back to IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0]
        else:
            ip = request.client.host
        return f"{self.key_prefix}:{ip}"

    async def is_rate_limited(self, request: Request) -> bool:
        """Check if the request should be rate limited."""
        key = self._get_key(request)
        
        # Use Redis pipeline for atomic operations
        pipe = redis_client.pipeline()
        now = time.time()
        
        # Clean old requests
        pipe.zremrangebyscore(key, 0, now - self.seconds)
        
        # Count requests in the current window
        pipe.zcard(key)
        
        # Add current request
        pipe.zadd(key, {str(now): now})
        
        # Set expiry on the key
        pipe.expire(key, self.seconds)
        
        # Execute pipeline
        _, request_count, *_ = pipe.execute()
        
        return request_count > self.times

    def get_retry_after(self) -> int:
        """Get the number of seconds until the rate limit resets."""
        return self.seconds

# Rate limit configurations for different endpoint types
RATE_LIMITS = {
    "default": RateLimiter(times=100, seconds=60),  # 100 requests per minute
    "search": RateLimiter(times=20, seconds=60),    # 20 searches per minute
    "bulk": RateLimiter(times=10, seconds=60)       # 10 bulk operations per minute
}

async def rate_limit_middleware(
    request: Request,
    call_next: Callable,
    limiter: Optional[RateLimiter] = None
) -> JSONResponse:
    """Middleware to apply rate limiting to requests."""
    # Determine which rate limiter to use
    if limiter is None:
        limiter = RATE_LIMITS["default"]

    # Check rate limit
    if await limiter.is_rate_limited(request):
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Too many requests",
                "retry_after": limiter.get_retry_after()
            }
        )

    # Process the request if not rate limited
    response = await call_next(request)
    return response 