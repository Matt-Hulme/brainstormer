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