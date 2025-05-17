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

@router.post("/", response_model=Project)
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

@router.get("/", response_model=List[Project])
async def list_projects(request: Request):
    """List all projects for the authenticated user."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .select("*")\
        .eq("user_id", request.state.user_id)\
        .order("updated_at", desc=True)\
        .execute()
    
    return result.data

@router.get("/{project_name}/", response_model=Project)
async def get_project(project_name: str, request: Request):
    """Get a specific project by name."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .select("*")\
        .eq("name", project_name)\
        .eq("user_id", request.state.user_id)\
        .single()\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return result.data

@router.put("/{project_name}/", response_model=Project)
async def update_project(
    project_name: str,
    project: ProjectBase,
    request: Request
):
    """Update a project's name."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .update({"name": project.name})\
        .eq("name", project_name)\
        .eq("user_id", request.state.user_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return result.data[0]

@router.delete("/{project_name}/")
async def delete_project(project_name: str, request: Request):
    """Delete a project by name."""
    supabase = get_supabase_client()
    
    result = supabase.table("projects")\
        .delete()\
        .eq("name", project_name)\
        .eq("user_id", request.state.user_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"message": "Project deleted successfully"} 