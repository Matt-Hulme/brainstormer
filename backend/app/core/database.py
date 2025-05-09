from supabase import create_client, Client
from .config import get_settings

settings = get_settings()

def get_supabase_client() -> Client:
    """Get a Supabase client instance."""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_KEY
    ) 