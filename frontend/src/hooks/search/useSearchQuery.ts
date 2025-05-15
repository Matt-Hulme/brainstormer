import { useQuery } from '@tanstack/react-query'
import { searchApi } from '@/services/api/search'
import type { SearchResponse } from '@/config/api/types'

export const useSearchQuery = (projectName: string, query: string) => {
    return useQuery<SearchResponse, Error>({
        queryKey: ['search', projectName, query],
        queryFn: () => searchApi.search({ projectName, query }),
        enabled: !!projectName && !!query,
    })
} 