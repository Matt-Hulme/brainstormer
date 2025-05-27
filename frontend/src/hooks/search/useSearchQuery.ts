import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/services/api/search'
import type { SearchResponse } from '@/config/api/types'

export const useSearchQuery = (
    projectId: string,
    query: string,
    searchMode: 'or' | 'and' | 'both' = 'both'
) => {
    return useQuery<SearchResponse, Error>({
        queryKey: ['search', projectId, query, searchMode],
        queryFn: () => searchApi.search({ projectId, query, searchMode }),
        enabled: !!projectId && !!query,
    })
} 