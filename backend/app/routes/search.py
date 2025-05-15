from fastapi import APIRouter, HTTPException, Request
from typing import List
from pydantic import BaseModel
from datetime import datetime
import uuid
from ..core.database import get_supabase_client
from ..core.openai_client import get_openai_client

router = APIRouter(prefix="/search", tags=["search"])

class SearchRequest(BaseModel):
    query: str
    project_name: str

class KeywordSuggestion(BaseModel):
    word: str
    score: float

class SearchResponse(BaseModel):
    search_id: str
    suggestions: List[KeywordSuggestion]

@router.post("/", response_model=SearchResponse)
async def search_keywords(
    search: SearchRequest,
    request: Request
):
    """Search for keyword suggestions based on a query."""
    supabase = get_supabase_client()
    
    # Get the most recently updated project with the given name
    projects = supabase.table("projects")\
        .select("id")\
        .eq("name", search.project_name)\
        .eq("user_id", request.state.user_id)\
        .order("updated_at", desc=True)\
        .limit(1)\
        .execute()
    
    if not projects.data or len(projects.data) == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get the project ID from the most recent result
    project_id = projects.data[0]["id"]
    
    # Generate a unique search ID
    search_id = str(uuid.uuid4())
    
    # Get keyword suggestions from OpenAI
    openai = get_openai_client()
    try:
        response = await openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a keyword suggestion expert. 
                    Given a search query, generate relevant keyword suggestions.
                    Return only the keywords, one per line, with no additional text."""
                },
                {
                    "role": "user",
                    "content": f"Generate keyword suggestions for: {search.query}"
                }
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        # Process suggestions
        suggestions_text = response.choices[0].message.content.strip()
        suggestions = [
            KeywordSuggestion(word=word.strip(), score=1.0)  # Score is 1.0 for now
            for word in suggestions_text.split('\n')
            if word.strip()
        ]
        
        # Store search session using project_id
        supabase.table("search_sessions").insert({
            "id": search_id,
            "project_id": project_id,
            "query": search.query,
            "user_id": request.state.user_id
        }).execute()
        
        return SearchResponse(
            search_id=search_id,
            suggestions=suggestions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 