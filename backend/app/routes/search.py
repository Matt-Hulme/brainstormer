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
    project_id: str

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
    
    # Verify project ownership
    project = supabase.table("projects")\
        .select("id")\
        .eq("id", search.project_id)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
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
        
        # Store search session
        supabase.table("search_sessions").insert({
            "id": search_id,
            "project_id": search.project_id,
            "query": search.query,
            "user_id": request.state.user_id
        }).execute()
        
        return SearchResponse(
            search_id=search_id,
            suggestions=suggestions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate suggestions: {str(e)}"
        ) 