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
  get: async (projectName: string) => {
    if (!projectName) {
      throw new Error('Project name is required')
    }
    const response = await api.get<Project>(`${BASE_PATH}${projectName}/`)
    return response.data
  },

  // Update a project
  update: async (projectName: string, data: CreateProjectRequest) => {
    if (!projectName) {
      throw new Error('Project name is required')
    }
    const response = await api.put<Project>(`${BASE_PATH}${projectName}/`, data)
    return response.data
  },

  // Delete a project
  delete: async (projectName: string) => {
    if (!projectName) {
      throw new Error('Project name is required')
    }
    const response = await api.delete(`${BASE_PATH}${projectName}/`)
    return response.data
  },
}
