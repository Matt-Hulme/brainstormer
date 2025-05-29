import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/services/api/search'
import type { SearchResponse } from '@/config/api/types'
import { useSearchResultsCache } from './useSearchResultsCache'

export const useSearchQuery = (
    projectId: string,
    query: string,
    searchMode: 'or' | 'and' = 'or',
    excludeWords: string[] = []
) => {
    const { getCachedResult, setCachedResult } = useSearchResultsCache()

    // Create a unique cache key that includes excludeWords
    const cacheKey = excludeWords.length > 0
        ? `${projectId}-${query}-${searchMode}-exclude-${excludeWords.length}`
        : `${projectId}-${query}-${searchMode}`

    // Get cached result to use as initial data (only for initial searches, not load more)
    const cachedResult = excludeWords.length === 0 ? getCachedResult(projectId, query, searchMode) : null

    return useQuery<SearchResponse, Error>({
        queryKey: ['search', projectId, query, searchMode, excludeWords],
        queryFn: async () => {
            // Fetch from API
            const result = await searchApi.search({ projectId, query, searchMode, excludeWords })

            // Cache the result only for initial searches (not load more)
            if (excludeWords.length === 0) {
                setCachedResult(projectId, query, searchMode, result)
            }

            return result
        },
        enabled: !!projectId && !!query,
        initialData: cachedResult || undefined,
        staleTime: excludeWords.length > 0 ? 0 : 5 * 60 * 1000, // Don't cache load more results
        gcTime: excludeWords.length > 0 ? 0 : 10 * 60 * 1000, // Don't keep load more in cache
    })
} 