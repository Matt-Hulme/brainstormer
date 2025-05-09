from openai import AsyncOpenAI
from .config import get_settings

settings = get_settings()

def get_openai_client() -> AsyncOpenAI:
    """Get an OpenAI client instance."""
    return AsyncOpenAI(
        api_key=settings.OPENAI_API_KEY
    ) 