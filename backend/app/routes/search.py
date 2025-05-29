from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from pydantic import BaseModel
from ..core.database import get_supabase_client
from ..core.openai_client import get_openai_client
import re

router = APIRouter(prefix="/search", tags=["search"])

class SearchRequest(BaseModel):
    query: str
    project_id: str
    search_mode: Optional[str] = "or"  # "or" or "and"

class KeywordSuggestion(BaseModel):
    word: str
    match_type: Optional[str] = None  # "and", "or", or None for single phrase search

class SearchResponse(BaseModel):
    suggestions: List[KeywordSuggestion]
    search_id: Optional[str] = None

@router.post("", response_model=SearchResponse)
async def search_keywords(
    search: SearchRequest,
    request: Request
):
    """Search for keyword suggestions based on a query."""
    supabase = get_supabase_client()
    
    # Verify the project exists and user has access to it
    project = supabase.table("projects")\
        .select("id")\
        .eq("id", search.project_id)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Parse multiple phrases
    phrases = [phrase.strip() for phrase in search.query.split("+") if phrase.strip()]
    
    # Get keyword suggestions from OpenAI
    openai = get_openai_client()
    try:
        suggestions = []
        
        # Always generate OR results
        if len(phrases) == 1:
            or_query = search.query
            system_message = f"""You are a Scattershot Brainstormer. Your job is to generate a diverse list of at least 100 keywords related to "{or_query}".
                Instructions:
                - Generate at least 100 words or phrases related to "{or_query}"
                - Include both single words and multi-word phrases, evenly mixed
                - The words should not be organized in any particular order
                - Ensure diversity across different fields: science, medicine, gaming, design, history, etc.
                - Each item should be on its own line with NO prefix characters (no bullet points, no dashes)
                - Do not number your list
                - Separate items using ONLY line breaks

                The goal is to provide a wide range of potential connections to "{or_query}" across different domains and contexts."""
        else:
            # For multiple phrases, create a more specific prompt
            phrases_list = ", ".join([f'"{phrase}"' for phrase in phrases])
            system_message = f"""You are a Scattershot Brainstormer. Your job is to generate a diverse list of at least 100 keywords related to ANY of these phrases: {phrases_list}.
                Instructions:
                - Generate at least 100 words or phrases related to ONE OR MORE of these phrases: {phrases_list}
                - Each suggestion should clearly relate to at least one of the phrases
                - Include both single words and multi-word phrases, evenly mixed
                - The words should not be organized in any particular order
                - Ensure diversity across different fields: science, medicine, gaming, design, history, etc.
                - Each item should be on its own line with NO prefix characters (no bullet points, no dashes)
                - Do not number your list
                - Separate items using ONLY line breaks

                The goal is to provide a wide range of potential connections to any of these phrases: {phrases_list}."""
        
        response = await openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": system_message}],
            temperature=1.0,
        )
        
        # Process suggestions - always set match_type to "or" for consistency
        suggestions_text = response.choices[0].message.content.strip()
        # Split by newlines and clean each item
        or_suggestions = [
            KeywordSuggestion(word=word.strip().lstrip('-•*').strip(), match_type="or") 
            for word in suggestions_text.split('\n')
            if word.strip()
        ]
        suggestions.extend(or_suggestions)
        
        # For multiple phrases, always generate AND results regardless of search mode
        # This ensures users can switch between OR and AND modes and see results for both
        if len(phrases) > 1:
            all_phrases = " AND ".join([f'"{phrase}"' for phrase in phrases])
            
            system_message = f"""You are a Focused Brainstormer. Your job is to generate keywords that MUST be strongly related to ALL of the following concepts simultaneously: {all_phrases}.
                Instructions:
                - Generate words or phrases that have a DIRECT and MEANINGFUL connection to EACH of these concepts: {all_phrases}
                - Each suggestion MUST strongly relate to ALL concepts, not just one or some of them
                - Be extremely strict about this requirement - if a word only relates to one phrase but not others, DO NOT include it
                - Aim for quality over quantity - it's better to provide fewer results that truly connect all concepts
                - Prefer more specific terms that clearly demonstrate the intersection of all concepts
                - Include both single words and multi-word phrases
                - Each item should be on its own line with NO prefix characters
                - Do not number your list
                - Separate items using ONLY line breaks
                
                The goal is to find the TRUE intersection of these different concepts - words that genuinely relate to ALL of them simultaneously."""
            
            response = await openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": system_message}],
                temperature=1.0,
            )
            
            # Process suggestions
            suggestions_text = response.choices[0].message.content.strip()
            # Split by newlines and clean each item
            and_suggestions = [
                KeywordSuggestion(word=word.strip().lstrip('-•*').strip(), match_type="and") 
                for word in suggestions_text.split('\n')
                if word.strip()
            ]
            suggestions.extend(and_suggestions)
        
        return SearchResponse(suggestions=suggestions)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 