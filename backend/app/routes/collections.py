from fastapi import APIRouter, HTTPException, Request
from typing import List
from pydantic import BaseModel
from datetime import datetime
from ..core.database import get_supabase_client

router = APIRouter(prefix="/collections", tags=["collections"])

class CollectionBase(BaseModel):
    name: str
    project_id: str

class CollectionCreate(CollectionBase):
    pass

class Collection(CollectionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BulkUpdateCollections(BaseModel):
    collection_ids: List[str]
    name: str

class BulkMoveCollections(BaseModel):
    collection_ids: List[str]
    target_project_id: str

class AddWordRequest(BaseModel):
    word: str

@router.post("/", response_model=Collection)
async def create_collection(
    collection: CollectionCreate,
    request: Request
):
    """Create a new collection in a project."""
    supabase = get_supabase_client()
    
    # Verify project ownership
    project = supabase.table("projects")\
        .select("id")\
        .eq("id", collection.project_id)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    data = {
        "name": collection.name,
        "project_id": collection.project_id
    }
    
    result = supabase.table("collections").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create collection")
    
    return result.data[0]

@router.get("/project/{project_id}", response_model=List[Collection])
async def list_collections(project_id: str, request: Request):
    """List all collections in a project."""
    supabase = get_supabase_client()
    
    # Verify project ownership
    project = supabase.table("projects")\
        .select("id")\
        .eq("id", project_id)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    result = supabase.table("collections")\
        .select("*")\
        .eq("project_id", project_id)\
        .order("updated_at", desc=True)\
        .execute()
    
    return result.data

@router.get("/{collection_id}", response_model=Collection)
async def get_collection(collection_id: str, request: Request):
    """Get a specific collection by ID."""
    supabase = get_supabase_client()
    
    result = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    return result.data

@router.put("/{collection_id}", response_model=Collection)
async def update_collection(
    collection_id: str,
    collection: CollectionBase,
    request: Request
):
    """Update a collection's name."""
    supabase = get_supabase_client()
    
    # Verify collection ownership through project
    existing = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not existing.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    result = supabase.table("collections")\
        .update({"name": collection.name})\
        .eq("id", collection_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to update collection")
    
    return result.data[0]

@router.delete("/{collection_id}")
async def delete_collection(collection_id: str, request: Request):
    """Delete a collection."""
    supabase = get_supabase_client()
    
    # Verify collection ownership through project
    existing = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not existing.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    result = supabase.table("collections")\
        .delete()\
        .eq("id", collection_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to delete collection")
    
    return {"message": "Collection deleted successfully"}

@router.put("/bulk/update", response_model=List[Collection])
async def bulk_update_collections(
    bulk_update: BulkUpdateCollections,
    request: Request
):
    """Update multiple collections' names."""
    supabase = get_supabase_client()
    
    # Verify collections ownership through projects
    collections = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .in_("id", bulk_update.collection_ids)\
        .eq("projects.user_id", request.state.user_id)\
        .execute()
    
    if not collections.data:
        raise HTTPException(status_code=404, detail="No collections found")
    
    # Update all collections
    result = supabase.table("collections")\
        .update({"name": bulk_update.name})\
        .in_("id", bulk_update.collection_ids)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to update collections")
    
    return result.data

@router.put("/bulk/move", response_model=List[Collection])
async def bulk_move_collections(
    bulk_move: BulkMoveCollections,
    request: Request
):
    """Move multiple collections to a different project."""
    supabase = get_supabase_client()
    
    # Verify target project ownership
    target_project = supabase.table("projects")\
        .select("id")\
        .eq("id", bulk_move.target_project_id)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not target_project.data:
        raise HTTPException(status_code=404, detail="Target project not found")
    
    # Verify collections ownership through projects
    collections = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .in_("id", bulk_move.collection_ids)\
        .eq("projects.user_id", request.state.user_id)\
        .execute()
    
    if not collections.data:
        raise HTTPException(status_code=404, detail="No collections found")
    
    # Move collections to target project
    result = supabase.table("collections")\
        .update({"project_id": bulk_move.target_project_id})\
        .in_("id", bulk_move.collection_ids)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to move collections")
    
    return result.data

@router.delete("/bulk")
async def bulk_delete_collections(
    collection_ids: List[str],
    request: Request
):
    """Delete multiple collections."""
    supabase = get_supabase_client()
    
    # Verify collections ownership through projects
    collections = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .in_("id", collection_ids)\
        .eq("projects.user_id", request.state.user_id)\
        .execute()
    
    if not collections.data:
        raise HTTPException(status_code=404, detail="No collections found")
    
    # Delete collections
    result = supabase.table("collections")\
        .delete()\
        .in_("id", collection_ids)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to delete collections")
    
    return {"message": "Collections deleted successfully"}

@router.post("/{collection_id}/word", response_model=Collection)
async def add_word_to_collection(
    collection_id: str,
    request_data: AddWordRequest,
    request: Request
):
    """Add a single word to a collection."""
    supabase = get_supabase_client()
    
    # Verify collection ownership through project
    existing = supabase.table("collections")\
        .select("*, projects!inner(*)")\
        .eq("id", collection_id)\
        .eq("projects.user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not existing.data:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # Check if word already exists in the collection
    existing_word = supabase.table("saved_words")\
        .select("word")\
        .eq("collection_id", collection_id)\
        .eq("word", request_data.word)\
        .execute()
    
    # Only add the word if it doesn't already exist
    if not existing_word.data:
        # Insert the new word
        supabase.table("saved_words").insert({
            "word": request_data.word,
            "collection_id": collection_id
        }).execute()
    
    # Get updated collection with words
    result = supabase.table("collections")\
        .select("*, saved_words(*)")\
        .eq("id", collection_id)\
        .single()\
        .execute()
    
    return result.data 