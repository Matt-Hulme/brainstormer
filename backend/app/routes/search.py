from fastapi import APIRouter, HTTPException, Request
from typing import List
from pydantic import BaseModel
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
                    "content": """You are a Scattershot Brainstormer. Your job is to take a single word input from the user and generate a diverse list of 100 relevant words associated with it.Instructions:
                    - Do not assume the user's intent—generate words that span multiple fields and applications, such as writing, science, medicine, gaming, design, history, etc.
                    - The words should not be organized in any particular order. They should feel random yet relevant to the input word.
                    - Ensure that **both single words and multi-word phrases** appear **evenly throughout the list** to maintain a natural scatter.
                    - Avoid clustering single words at the beginning and longer phrases at the end.
                    - Output each word as a bullet point in a single-column format.
                    The goal is to spark creativity and cover a wide range of potential connections. The user will provide the input word in the next message."""
                },
                {
                    "role": "user",
                    "content": f"Generate exactly 100 keyword suggestions for: {search.query}"
                }
            ],
            temperature=0.7,
        )
        
        # Process suggestions
        suggestions_text = response.choices[0].message.content.strip()
        suggestions = [
            KeywordSuggestion(word=word.strip(), score=1.0) 
            for word in suggestions_text.split('\n')
            if word.strip()
        ]
        
        return SearchResponse(suggestions=suggestions)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 