from pydantic import BaseModel
from functools import lru_cache
from typing import Optional
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the root directory (3 levels up from this file)
ROOT_DIR = Path(__file__).parent.parent.parent.parent

# Load environment variables from .env file
load_dotenv(dotenv_path=str(ROOT_DIR / ".env"))

# Print for debugging
print(f"Loading .env from: {str(ROOT_DIR / '.env')}")
print(f"Is .env file exists: {(ROOT_DIR / '.env').exists()}")

class Settings(BaseModel):
    # Supabase settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Brainstormer API"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Security settings
    ANONYMOUS_USER_PREFIX: str = "anon_"
    JWT_SECRET: str = os.getenv("JWT_SECRET", "")
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Debug settings
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    
    # Redis settings for rate limiting
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    
    class Config:
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    # Print for debugging
    print(f"ADMIN_USERNAME: {settings.ADMIN_USERNAME}")
    print(f"ADMIN_PASSWORD length: {len(settings.ADMIN_PASSWORD)}")
    print(f"JWT_SECRET length: {len(settings.JWT_SECRET)}")
    return settings 