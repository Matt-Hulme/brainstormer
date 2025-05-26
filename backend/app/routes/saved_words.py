from fastapi import APIRouter, HTTPException, Request
from typing import List
from pydantic import BaseModel
from datetime import datetime
from ..core.database import get_supabase_client

router = APIRouter(prefix="/saved-words", tags=["saved-words"])

class SavedWordBase(BaseModel):
    word: str
    collection_id: str

class SavedWordCreate(SavedWordBase):
    pass

class SavedWord(SavedWordBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class BulkSaveWords(BaseModel):
    words: List[str]
    collection_id: str

class BulkMoveWords(BaseModel):
    word_ids: List[str]
    target_collection_id: str

@router.post("", response_model=SavedWord)
async def create_saved_word(
    saved_word: SavedWordCreate,
    request: Request
):
    """Save a single word to a collection."""
    supabase = get_supabase_client()
    
    # Verify collection ownership through project
    collection = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", saved_word.collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not collection.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check if word already exists in collection
    existing = supabase.table("saved_words")\
        .select("id")\
        .eq("collection_id", saved_word.collection_id)\
        .eq("word", saved_word.word)\
        .single()\
        .execute()
    
    if existing.data:
        raise HTTPException(status_code=400, detail="Word already exists in collection")
    
    data = {
        "word": saved_word.word,
        "collection_id": saved_word.collection_id
    }
    
    result = supabase.table("saved_words").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to save word")
    
    return result.data[0]

@router.post("/bulk", response_model=List[SavedWord])
async def bulk_save_words(
    bulk_save: BulkSaveWords,
    request: Request
):
    """Save multiple words to a collection."""
    supabase = get_supabase_client()
    
    # Verify collection ownership through project
    collection = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", bulk_save.collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not collection.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Get existing words to avoid duplicates
    existing = supabase.table("saved_words")\
        .select("word")\
        .eq("collection_id", bulk_save.collection_id)\
        .in_("word", bulk_save.words)\
        .execute()
    
    existing_words = {word["word"] for word in existing.data}
    new_words = [word for word in bulk_save.words if word not in existing_words]
    
    if not new_words:
        raise HTTPException(status_code=400, detail="All words already exist in collection")
    
    # Prepare data for bulk insert
    data = [
        {"word": word, "collection_id": bulk_save.collection_id}
        for word in new_words
    ]
    
    result = supabase.table("saved_words").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to save words")
    
    return result.data

@router.get("/collection/{collection_id}", response_model=List[SavedWord])
async def list_saved_words(collection_id: str, request: Request):
    """List all saved words in a collection."""
    supabase = get_supabase_client()
    
    # Verify collection ownership through project
    collection = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not collection.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    result = supabase.table("saved_words")\
        .select("*")\
        .eq("collection_id", collection_id)\
        .order("created_at", desc=True)\
        .execute()
    
    return result.data

@router.delete("/{word_id}")
async def delete_saved_word(word_id: str, request: Request):
    """Delete a saved word."""
    supabase = get_supabase_client()
    
    # Verify word ownership through collection and project
    word = supabase.table("saved_words")\
        .select("*, collections!inner(*, projects!inner(*))")\
        .eq("id", word_id)\
        .eq("collections.projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not word.data:
        raise HTTPException(status_code=404, detail="Word not found")
    
    result = supabase.table("saved_words")\
        .delete()\
        .eq("id", word_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to delete word")
    
    return {"message": "Word deleted successfully"}

@router.put("/bulk/move", response_model=List[SavedWord])
async def bulk_move_words(
    bulk_move: BulkMoveWords,
    request: Request
):
    """Move multiple words to a different collection."""
    supabase = get_supabase_client()
    
    # Verify target collection ownership through project
    target_collection = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", bulk_move.target_collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not target_collection.data:
        raise HTTPException(status_code=404, detail="Target collection not found")
    
    # Verify words ownership through collections and projects
    words = supabase.table("saved_words")\
        .select("*, collections!inner(*, projects!inner(*))")\
        .in_("id", bulk_move.word_ids)\
        .eq("collections.projects.user_id", request.state.user_id)\
        .execute()
    
    if not words.data:
        raise HTTPException(status_code=404, detail="No words found")
    
    # Move words to target collection
    result = supabase.table("saved_words")\
        .update({"collection_id": bulk_move.target_collection_id})\
        .in_("id", bulk_move.word_ids)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to move words")
    
    return result.data

@router.delete("/bulk")
async def bulk_delete_words(
    word_ids: List[str],
    request: Request
):
    """Delete multiple saved words."""
    supabase = get_supabase_client()
    
    # Verify words ownership through collections and projects
    words = supabase.table("saved_words")\
        .select("*, collections!inner(*, projects!inner(*))")\
        .in_("id", word_ids)\
        .eq("collections.projects.user_id", request.state.user_id)\
        .execute()
    
    if not words.data:
        raise HTTPException(status_code=404, detail="No words found")
    
    # Delete words
    result = supabase.table("saved_words")\
        .delete()\
        .in_("id", word_ids)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to delete words")
    
    return {"message": "Words deleted successfully"} 