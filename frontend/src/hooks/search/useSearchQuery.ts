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

    return useQuery<SearchResponse, Error>({
        queryKey: ['search', projectId, query, searchMode],
        queryFn: async () => {
            // Check cache first
            const cachedResult = getCachedResult(projectId, query, searchMode)
            if (cachedResult) {
                return cachedResult
            }

            // If not in cache, fetch from API
            const result = await searchApi.search({ projectId, query, searchMode })

            // Cache the result
            setCachedResult(projectId, query, searchMode, result)

            return result
        },
        enabled: !!projectId && !!query,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in React Query cache for 10 minutes
    })
} 