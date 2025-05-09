import { useState, useEffect } from 'react'
import { SavedWord } from '@/types'
import { savedWordsApi } from '@/services/api/savedWords'

interface UseGetSavedWordsQueryReturn {
  savedWords: SavedWord[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useGetSavedWordsQuery = (collectionId: string): UseGetSavedWordsQueryReturn => {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSavedWords = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await savedWordsApi.listByCollection(collectionId)
      setSavedWords(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch saved words'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (collectionId) {
      fetchSavedWords()
    }
  }, [collectionId])

  return {
    savedWords,
    loading,
    error,
    refetch: fetchSavedWords,
  }
}
