import api from '@/config/api/client'
import type {
  BulkMoveCollectionsRequest,
  BulkUpdateCollectionsRequest,
  CreateCollectionRequest,
} from '@/config/api/types'
import type { Collection } from '@/types'
import camelcaseKeys from 'camelcase-keys'

const BASE_PATH = '/collections'

export const collectionsApi = {
  addWord: async (collectionId: string, word: string) => {
    const response = await api.post(`${BASE_PATH}/${collectionId}/word`, { word })
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection
  },

  bulkDelete: async (collectionIds: string[]) => {
    const response = await api.delete(`${BASE_PATH}/bulk`, {
      data: collectionIds,
    })
    return camelcaseKeys(response.data, { deep: true })
  },

  bulkMove: async (data: BulkMoveCollectionsRequest) => {
    const response = await api.put(`${BASE_PATH}/bulk/move`, {
      collection_ids: data.collectionIds,
      target_project_id: data.targetProjectId,
    })
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection[]
  },

  bulkUpdate: async (data: BulkUpdateCollectionsRequest) => {
    const response = await api.put(`${BASE_PATH}/bulk/update`, {
      collection_ids: data.collectionIds,
      name: data.name,
    })
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection[]
  },

  create: async (data: CreateCollectionRequest) => {
    const response = await api.post(BASE_PATH, {
      name: data.name,
      project_id: data.projectId
    })
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection
  },

  delete: async (collectionId: string) => {
    const response = await api.delete(`${BASE_PATH}/${collectionId}`)
    return camelcaseKeys(response.data, { deep: true })
  },

  get: async (collectionId: string) => {
    const response = await api.get(`${BASE_PATH}/${collectionId}`)
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection
  },

  listByProject: async (projectId: string) => {
    const response = await api.get(`${BASE_PATH}/project/${projectId}`)
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection[]
  },

  removeWord: async (collectionId: string, word: string) => {
    const response = await api.delete(`${BASE_PATH}/${collectionId}/word`, { data: { word } })
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection
  },

  update: async (collectionId: string, data: CreateCollectionRequest) => {
    const response = await api.put(`${BASE_PATH}/${collectionId}`, data)
    return camelcaseKeys(response.data, { deep: true }) as unknown as Collection
  },


}
