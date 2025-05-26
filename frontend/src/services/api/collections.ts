import api from '@/config/api/client'
import type {
  BulkMoveCollectionsRequest,
  BulkUpdateCollectionsRequest,
  CreateCollectionRequest,
} from '@/config/api/types'
import type { Collection } from '@/types'

const BASE_PATH = '/collections'

export const collectionsApi = {
  addWord: async (collectionId: string, word: string) => {
    const response = await api.post<Collection>(`${BASE_PATH}/${collectionId}/word`, { word })
    return response.data
  },

  bulkDelete: async (collectionIds: string[]) => {
    const response = await api.delete(`${BASE_PATH}/bulk`, {
      data: collectionIds,
    })
    return response.data
  },

  bulkMove: async (data: BulkMoveCollectionsRequest) => {
    const response = await api.put<Collection[]>(`${BASE_PATH}/bulk/move`, {
      collection_ids: data.collectionIds,
      target_project_id: data.targetProjectId,
    })
    return response.data
  },

  bulkUpdate: async (data: BulkUpdateCollectionsRequest) => {
    const response = await api.put<Collection[]>(`${BASE_PATH}/bulk/update`, {
      collection_ids: data.collectionIds,
      name: data.name,
    })
    return response.data
  },

  create: async (data: CreateCollectionRequest) => {
    const response = await api.post<Collection>(BASE_PATH, {
      name: data.name,
      project_id: data.projectId
    })
    return response.data
  },

  delete: async (collectionId: string) => {
    const response = await api.delete(`${BASE_PATH}/${collectionId}`)
    return response.data
  },

  get: async (collectionId: string) => {
    const response = await api.get<Collection>(`${BASE_PATH}/${collectionId}`)
    return response.data
  },

  listByProject: async (projectId: string) => {
    const response = await api.get<Collection[]>(`${BASE_PATH}/project/${projectId}`)
    return response.data
  },

  removeWord: async (collectionId: string, word: string) => {
    const response = await api.delete<Collection>(`${BASE_PATH}/${collectionId}/word`, { data: { word } })
    return response.data
  },

  update: async (collectionId: string, data: CreateCollectionRequest) => {
    const response = await api.put<Collection>(`${BASE_PATH}/${collectionId}`, data)
    return response.data
  },
}
