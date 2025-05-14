import { useState } from 'react'
import { SavedWord } from '@/types'
import { savedWordsApi } from '@/services/api/savedWords'
import type { SaveWordRequest } from '@/config/api/types'

interface UseSavedWordMutationsReturn {
  loading: boolean
  error: Error | null
  saveWord: (data: SaveWordRequest) => Promise<SavedWord>
  bulkSaveWords: (words: string[], collectionId: string) => Promise<SavedWord[]>
  deleteWord: (wordId: string) => Promise<void>
  bulkMoveWords: (wordIds: string[], targetCollectionId: string) => Promise<SavedWord[]>
  bulkDeleteWords: (wordIds: string[]) => Promise<void>
}

export const useSavedWordMutations = (): UseSavedWordMutationsReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const saveWord = async (data: SaveWordRequest) => {
    try {
      setLoading(true)
      setError(null)
      const result = await savedWordsApi.create(data)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save word')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const bulkSaveWords = async (words: string[], collectionId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await savedWordsApi.bulkSave(words, collectionId)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk save words')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteWord = async (wordId: string) => {
    try {
      setLoading(true)
      setError(null)
      await savedWordsApi.delete(wordId)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete word')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const bulkMoveWords = async (wordIds: string[], targetCollectionId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await savedWordsApi.bulkMove({ wordIds, targetCollectionId })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk move words')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const bulkDeleteWords = async (wordIds: string[]) => {
    try {
      setLoading(true)
      setError(null)
      await savedWordsApi.bulkDelete(wordIds)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk delete words')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    saveWord,
    bulkSaveWords,
    deleteWord,
    bulkMoveWords,
    bulkDeleteWords,
  }
}
