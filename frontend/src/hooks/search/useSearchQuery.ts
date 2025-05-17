import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/services/api/search'
import type { SearchResponse } from '@/config/api/types'

export const useSearchQuery = (
    projectName: string,
    query: string,
    searchMode: 'or' | 'and' | 'both' = 'both'
) => {
    return useQuery<SearchResponse, Error>({
        queryKey: ['search', projectName, query, searchMode],
        queryFn: () => searchApi.search({ projectName, query, searchMode }),
        enabled: !!projectName && !!query,
    })
} 