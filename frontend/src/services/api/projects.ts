import api from '@/config/api/client'
import type { Project } from '@/types'
import type { CreateProjectRequest } from '@/config/api/types'
import camelcaseKeys from 'camelcase-keys'

const BASE_PATH = '/projects/'

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
  get: async (projectName: string) => {
    if (!projectName) {
      throw new Error('Project name is required')
    }
    const response = await api.get(`${BASE_PATH}${projectName}/`)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },

  // Update a project
  update: async (projectName: string, data: CreateProjectRequest) => {
    if (!projectName) {
      throw new Error('Project name is required')
    }
    const response = await api.put(`${BASE_PATH}${projectName}/`, data)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },

  // Delete a project
  delete: async (projectName: string) => {
    if (!projectName) {
      throw new Error('Project name is required')
    }
    const response = await api.delete(`${BASE_PATH}${projectName}/`)
    return camelcaseKeys(response.data, { deep: true }) as Project
  },
}
