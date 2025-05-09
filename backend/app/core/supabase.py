from supabase import create_client, Client
from .config import get_settings

settings = get_settings()

def get_supabase_client() -> Client:
    """
    Creates and returns a Supabase client instance.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Create a singleton instance
supabase: Client = get_supabase_client() 