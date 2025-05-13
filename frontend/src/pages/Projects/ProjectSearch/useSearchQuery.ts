import { useState, useEffect } from 'react'
import { searchApi } from '@/services/api/search'
import { KeywordSuggestion } from '@/config/api/types'

interface UseSearchQueryReturn {
  results: KeywordSuggestion[]
  loading: boolean
  error: Error | null
}

export const useSearchQuery = (projectId: string, query: string): UseSearchQueryReturn => {
  const [results, setResults] = useState<KeywordSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await searchApi.search({ projectId, query })
        setResults(data.suggestions)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch search results'))
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [projectId, query])

  return {
    results,
    loading,
    error,
  }
}
