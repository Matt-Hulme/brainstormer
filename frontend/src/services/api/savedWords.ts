import api from '@/config/api/client'
import type { BulkMoveWordsRequest, SaveWordRequest } from '@/config/api/types'
import type { SavedWord } from '@/types'

const BASE_PATH = '/saved-words/'

export const savedWordsApi = {
  bulkDelete: async (wordIds: string[]) => {
    const response = await api.delete(`${BASE_PATH}/bulk`, {
      data: wordIds,
    })
    return response.data
  },

  bulkMove: async (data: BulkMoveWordsRequest) => {
    const response = await api.put<SavedWord[]>(`${BASE_PATH}/bulk/move`, {
      target_collection_id: data.targetCollectionId,
      word_ids: data.wordIds,
    })
    return response.data
  },

  bulkSave: async (words: string[], collectionId: string) => {
    const response = await api.post<SavedWord[]>(`${BASE_PATH}/bulk`, {
      collection_id: collectionId,
      words,
    })
    return response.data
  },

  create: async (data: SaveWordRequest) => {
    const response = await api.post<SavedWord>(BASE_PATH, {
      collection_id: data.collectionId,
      word: data.word,
    })
    return response.data
  },

  delete: async (wordId: string) => {
    const response = await api.delete(`${BASE_PATH}/${wordId}`)
    return response.data
  },

  listByCollection: async (collectionId: string) => {
    const response = await api.get<SavedWord[]>(`${BASE_PATH}/collection/${collectionId}`)
    return response.data
  },
}
