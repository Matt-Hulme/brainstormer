import api from '@/config/api/client'
import type { Collection } from '@/types'
import type {
  CreateCollectionRequest,
  BulkUpdateCollectionsRequest,
  BulkMoveCollectionsRequest,
} from '@/config/api/types'

const BASE_PATH = 'collections/'

export const collectionsApi = {
  // Create a new collection
  create: async (data: CreateCollectionRequest) => {
    const response = await api.post<Collection>(BASE_PATH, data)
    return response.data
  },

  // List collections in a project
  listByProject: async (projectId: string) => {
    const response = await api.get<Collection[]>(`${BASE_PATH}project/${projectId}`)
    return response.data
  },

  // Get a specific collection
  get: async (collectionId: string) => {
    const response = await api.get<Collection>(`${BASE_PATH}/${collectionId}`)
    return response.data
  },

  // Update a collection
  update: async (collectionId: string, data: CreateCollectionRequest) => {
    const response = await api.put<Collection>(`${BASE_PATH}/${collectionId}`, data)
    return response.data
  },

  // Delete a collection
  delete: async (collectionId: string) => {
    const response = await api.delete(`${BASE_PATH}/${collectionId}`)
    return response.data
  },

  // Add a single word to a collection
  addWord: async (collectionId: string, word: string) => {
    const response = await api.post<Collection>(`${BASE_PATH}/${collectionId}/word`, { word })
    return response.data
  },

  // Bulk update collections
  bulkUpdate: async (data: BulkUpdateCollectionsRequest) => {
    const response = await api.put<Collection[]>(`${BASE_PATH}/bulk/update`, {
      collection_ids: data.collectionIds,
      name: data.name,
    })
    return response.data
  },

  // Bulk move collections
  bulkMove: async (data: BulkMoveCollectionsRequest) => {
    const response = await api.put<Collection[]>(`${BASE_PATH}/bulk/move`, {
      collection_ids: data.collectionIds,
      target_project_id: data.targetProjectId,
    })
    return response.data
  },

  // Bulk delete collections
  bulkDelete: async (collectionIds: string[]) => {
    const response = await api.delete(`${BASE_PATH}/bulk`, {
      data: collectionIds,
    })
    return response.data
  },
}
