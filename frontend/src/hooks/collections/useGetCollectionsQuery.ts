import { useQuery } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'

export const useGetCollectionsQuery = (projectId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['collections', projectId],
        queryFn: () => collectionsApi.listByProject(projectId),
        enabled: !!projectId,
    })

    return {
        collections: data ?? [],
        loading: isLoading,
        error,
    }
} 