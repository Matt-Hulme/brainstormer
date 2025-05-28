import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/services/api/search'
import type { SearchResponse } from '@/config/api/types'
import { useSearchResultsCache } from './useSearchResultsCache'

export const useSearchQuery = (
    projectId: string,
    query: string,
    searchMode: 'or' | 'and' | 'both' = 'both'
) => {
    const { getCachedResult, setCachedResult } = useSearchResultsCache()

    // Get cached result to use as initial data
    const cachedResult = getCachedResult(projectId, query, searchMode)

    return useQuery<SearchResponse, Error>({
        queryKey: ['search', projectId, query, searchMode],
        queryFn: async () => {
            // Fetch from API
            const result = await searchApi.search({ projectId, query, searchMode })

            // Cache the result
            setCachedResult(projectId, query, searchMode, result)

            return result
        },
        enabled: !!projectId && !!query,
        initialData: cachedResult || undefined,
        staleTime: cachedResult ? 0 : 5 * 60 * 1000, // If we have cached data, consider it stale immediately to allow background refresh
        gcTime: 10 * 60 * 1000, // Keep in React Query cache for 10 minutes
    })
} 