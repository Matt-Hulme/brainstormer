from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import os
from pathlib import Path

# Get the root directory (2 levels up from this file)
ROOT_DIR = Path(__file__).parent.parent.parent.parent

class Settings(BaseSettings):
    # Supabase settings
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # OpenAI settings
    OPENAI_API_KEY: str
    
    # API settings
    API_V1_STR: str = "/api/mvp_v2"
    PROJECT_NAME: str = "Brainstormer API"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Security settings
    ANONYMOUS_USER_PREFIX: str = "anon_"
    JWT_SECRET: str
    ADMIN_USERNAME: str
    ADMIN_PASSWORD: str
    
    # Debug settings
    DEBUG: bool = True
    
    # Redis settings for rate limiting
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    class Config:
        env_file = str(ROOT_DIR / ".env")
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings() 