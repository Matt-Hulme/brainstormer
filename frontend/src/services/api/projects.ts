import api from '@/config/api/client'
import type { Project } from '@/types'
import type { CreateProjectRequest } from '@/config/api/types'

const BASE_PATH = '/projects/'

export const projectsApi = {
  // Create a new project
  create: async (data: CreateProjectRequest) => {
    const response = await api.post<Project>(BASE_PATH, data)
    return response.data
  },

  // List all projects
  list: async () => {
    // The backend handles user filtering based on the JWT token
    const response = await api.get<Project[]>(BASE_PATH)
    return response.data
  },

  // Get a specific project
  get: async (projectId: string) => {
    const response = await api.get<Project>(`${BASE_PATH}/${projectId}`)
    return response.data
  },

  // Update a project
  update: async (projectId: string, data: CreateProjectRequest) => {
    const response = await api.put<Project>(`${BASE_PATH}/${projectId}`, data)
    return response.data
  },

  // Delete a project
  delete: async (projectId: string) => {
    const response = await api.delete(`${BASE_PATH}/${projectId}`)
    return response.data
  },
}
