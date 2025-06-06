from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator, Dict, Set
from pydantic import BaseModel
import json
import uuid
import time
from ..core.database import get_supabase_client
from ..core.openai_client import get_openai_client

router = APIRouter(prefix="/search", tags=["search"])

class StreamSearchRequest(BaseModel):
    query: str
    project_id: str
    search_mode: str = "or"  # "or" or "and"
    session_id: str = None  # For load more requests
    is_load_more: bool = False

# Track sent words per session (in production, use Redis)
session_words: Dict[str, Set[str]] = {}
CACHE_EXPIRY = 30 * 60  # 30 minutes

def cleanup_expired_sessions():
    """Remove expired session data.""" 
    # For simplicity, we'll just clear old sessions periodically
    # In production, use Redis with TTL
    pass

async def stream_search_results(
    search: StreamSearchRequest,
    user_id: str
) -> AsyncGenerator[str, None]:
    """Stream search results in real-time with load more support."""
    supabase = get_supabase_client()
    
    # Verify the project exists and user has access to it
    project = supabase.table("projects")\
        .select("id")\
        .eq("id", search.project_id)\
        .eq("user_id", user_id)\
        .single()\
        .execute()
    
    if not project.data:
        yield f"data: {json.dumps({'type': 'error', 'message': 'Project not found'})}\n\n"
        return
    
    # Parse multiple phrases
    phrases = [phrase.strip() for phrase in search.query.split("+") if phrase.strip()]
    
    # Get keyword suggestions from OpenAI with streaming
    openai = get_openai_client()
    
    try:
        # Generate system message based on search mode
        if len(phrases) == 1:
            # Single phrase
            system_message = f"""You are a Scattershot Brainstormer. Your job is to generate a diverse list of at least 100 keywords related to "{search.query}".
                Instructions:
                - Generate at least 100 words or phrases related to "{search.query}"
                - Include both single words and multi-word phrases, evenly mixed
                - The words should not be organized in any particular order
                - Ensure diversity across different fields: science, medicine, gaming, design, history, etc.
                - Each item should be on its own line with NO prefix characters (no bullet points, no dashes)
                - Do not number your list
                - Separate items using ONLY line breaks

                The goal is to provide a wide range of potential connections to "{search.query}" across different domains and contexts."""
            match_type = "or"
            
        elif len(phrases) > 1 and search.search_mode == "or":
            # Multiple phrases in OR mode
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
            match_type = "or"
            
        elif len(phrases) > 1 and search.search_mode == "and":
            # Multiple phrases in AND mode
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
            match_type = "and"
            
        else:
            # Fallback case - default to OR mode for multiple phrases
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
            match_type = "or"

        # Get or create session ID
        session_id = search.session_id or str(uuid.uuid4())
        
        # Get existing words for this session (for load more)
        if session_id not in session_words:
            session_words[session_id] = set()
        
        existing_words = session_words[session_id]
        
        # Send initial status with session info
        yield f"data: {json.dumps({'type': 'status', 'message': 'Generating keywords...', 'session_id': session_id, 'is_load_more': search.is_load_more})}\n\n"

        # Create streaming OpenAI request
        stream = await openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": system_message}],
            temperature=1.0,
            stream=True
        )

        # Stream results in real-time, filtering against session words
        word_buffer = ""
        suggestions_sent = 0
        
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                word_buffer += content
                
                # Check for complete lines (words)
                while '\n' in word_buffer:
                    line, word_buffer = word_buffer.split('\n', 1)
                    word = line.strip().lstrip('-•*').strip()
                    
                    if word and len(word) <= 100 and word.lower() not in existing_words:  # Valid and not already sent
                        existing_words.add(word.lower())
                        suggestion = {
                            "word": word,
                            "match_type": match_type
                        }
                        print(f"Streaming word: {word}")  # Debug log
                        yield f"data: {json.dumps({'type': 'suggestion', 'data': suggestion})}\n\n"
                        suggestions_sent += 1
                        
                        # Send progress updates every 10 suggestions
                        if suggestions_sent % 10 == 0:
                            yield f"data: {json.dumps({'type': 'progress', 'count': suggestions_sent})}\n\n"

        # Process any remaining content in buffer
        if word_buffer.strip():
            word = word_buffer.strip().lstrip('-•*').strip()
            if word and len(word) <= 100 and word.lower() not in existing_words:
                existing_words.add(word.lower())
                suggestion = {
                    "word": word,
                    "match_type": match_type
                }
                yield f"data: {json.dumps({'type': 'suggestion', 'data': suggestion})}\n\n"
                suggestions_sent += 1

        # Send completion message with session info
        yield f"data: {json.dumps({'type': 'complete', 'total': suggestions_sent, 'session_id': session_id, 'total_session_words': len(existing_words)})}\n\n"
        
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

@router.post("/stream")
async def search_keywords_stream(
    search: StreamSearchRequest,
    request: Request
):
    """Stream search results in real-time as they come from OpenAI."""
    return StreamingResponse(
        stream_search_results(search, request.state.user_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        }
    ) 