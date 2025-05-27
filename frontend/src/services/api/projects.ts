import api from '@/config/api/client'
import type { CreateProjectRequest } from '@/config/api/types'
import type { Project } from '@/types'
import camelcaseKeys from 'camelcase-keys'

const BASE_PATH = '/projects'

export const projectsApi = {
  // Create a new project
  create: async (data: CreateProjectRequest) => {
    const response = await api.post(BASE_PATH, data)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },

  // List all projects
  list: async () => {
    // The backend handles user filtering based on the JWT token
    const response = await api.get(BASE_PATH)
    return camelcaseKeys(response.data, { deep: true }) as Project[]
  },

  // Get a specific project
  get: async (projectId: string) => {
    if (!projectId) {
      throw new Error('Project ID is required')
    }
    const response = await api.get(`${BASE_PATH}/${projectId}`)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },

  // Update a project
  update: async (projectId: string, data: CreateProjectRequest) => {
    if (!projectId) {
      throw new Error('Project ID is required')
    }
    const response = await api.put(`${BASE_PATH}/${projectId}`, data)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },

  // Delete a project
  delete: async (projectId: string) => {
    if (!projectId) {
      throw new Error('Project ID is required')
    }
    const response = await api.delete(`${BASE_PATH}/${projectId}`)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },
}
