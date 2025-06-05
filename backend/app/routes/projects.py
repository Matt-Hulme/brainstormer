from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from pydantic import BaseModel
from datetime import datetime
from ..core.database import get_supabase_client

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@router.post("", response_model=Project)
async def create_project(
    project: ProjectCreate,
    request: Request
):
    """Create a new project for the authenticated user."""
    supabase = get_supabase_client()
    
    data = {
        "name": project.name,
        "user_id": request.state.user_id
    }
    
    result = supabase.table("projects").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create project")
    
    return result.data[0]

@router.get("", response_model=List[Project])
async def list_projects(request: Request):
    """List all projects for the authenticated user."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .select("*")\
        .eq("user_id", request.state.user_id)\
        .order("updated_at", desc=True)\
        .execute()
    
    return result.data

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, request: Request):
    """Get a specific project by ID with its collections and saved words."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .select("*, collections(*, saved_words(*))")\
        .eq("id", project_id)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return result.data

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project: ProjectBase,
    request: Request
):
    """Update a project's name."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .update({"name": project.name})\
        .eq("id", project_id)\
        .eq("user_id", request.state.user_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return result.data[0]

@router.delete("/{project_id}")
async def delete_project(project_id: str, request: Request):
    """Delete a project by ID."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .delete()\
        .eq("id", project_id)\
        .eq("user_id", request.state.user_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"}

@router.delete("/bulk/all")
async def delete_all_projects(request: Request):
    """Delete all projects for the authenticated user."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .delete()\
        .eq("user_id", request.state.user_id)\
        .execute()
    
    return {"message": "All projects deleted successfully"} 