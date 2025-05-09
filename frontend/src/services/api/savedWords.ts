import api from '@/config/api/client'
import type { SavedWord } from '@/types'
import type { SaveWordRequest, BulkMoveWordsRequest } from '@/config/api/types'

const BASE_PATH = '/saved-words'

export const savedWordsApi = {
  // Save a single word
  create: async (data: SaveWordRequest) => {
    const response = await api.post<SavedWord>(BASE_PATH, {
      word: data.word,
      collection_id: data.collectionId,
    })
    return response.data
  },

  // Save multiple words at once
  bulkSave: async (words: string[], collectionId: string) => {
    const response = await api.post<SavedWord[]>(`${BASE_PATH}/bulk`, {
      words,
      collection_id: collectionId,
    })
    return response.data
  },

  // List saved words in a collection
  listByCollection: async (collectionId: string) => {
    const response = await api.get<SavedWord[]>(`${BASE_PATH}/collection/${collectionId}`)
    return response.data
  },

  // Delete a saved word
  delete: async (wordId: string) => {
    const response = await api.delete(`${BASE_PATH}/${wordId}`)
    return response.data
  },

  // Bulk move words
  bulkMove: async (data: BulkMoveWordsRequest) => {
    const response = await api.put<SavedWord[]>(`${BASE_PATH}/bulk/move`, {
      word_ids: data.wordIds,
      target_collection_id: data.targetCollectionId,
    })
    return response.data
  },

  // Bulk delete words
  bulkDelete: async (wordIds: string[]) => {
    const response = await api.delete(`${BASE_PATH}/bulk`, {
      data: wordIds,
    })
    return response.data
  },
}
