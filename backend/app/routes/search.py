from fastapi import APIRouter, HTTPException, Request
from typing import List
from pydantic import BaseModel
from ..core.database import get_supabase_client
from ..core.openai_client import get_openai_client
import re

router = APIRouter(prefix="/search", tags=["search"])

class SearchRequest(BaseModel):
    query: str
    project_name: str

class KeywordSuggestion(BaseModel):
    word: str

class SearchResponse(BaseModel):
    suggestions: List[KeywordSuggestion]

@router.post("/", response_model=SearchResponse)
async def search_keywords(
    search: SearchRequest,
    request: Request
):
    """Search for keyword suggestions based on a query."""
    supabase = get_supabase_client()
    
    # Verify the project exists and user has access to it
    projects = supabase.table("projects")\
        .select("id")\
        .eq("name", search.project_name)\
        .eq("user_id", request.state.user_id)\
        .order("updated_at", desc=True)\
        .limit(1)\
        .execute()
    
    if not projects.data or len(projects.data) == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get keyword suggestions from OpenAI
    openai = get_openai_client()
    try:
        response = await openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a Scattershot Brainstormer. Your job is to generate a diverse list of at least 100 keywords related to "{search.query}".
                    Instructions:
                    - Generate at least 100 words or phrases related to "{search.query}"
                    - Include both single words and multi-word phrases, evenly mixed
                    - The words should not be organized in any particular order
                    - Ensure diversity across different fields: science, medicine, gaming, design, history, etc.
                    - Each item should be on its own line with NO prefix characters (no bullet points, no dashes)
                    - Do not number your list
                    - Separate items using ONLY line breaks

                    The goal is to provide a wide range of potential connections to "{search.query}" across different domains and contexts."""
                }
            ],
            temperature=0.7,
        )
        
        # Process suggestions
        suggestions_text = response.choices[0].message.content.strip()
        # Split by newlines and clean each item
        suggestions = [
            KeywordSuggestion(word=word.strip().lstrip('-•*').strip()) 
            for word in suggestions_text.split('\n')
            if word.strip()
        ]
        
        return SearchResponse(suggestions=suggestions)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 