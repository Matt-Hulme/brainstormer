import { useQuery } from '@tanstack/react-query'
import type { Collection } from '../../types'
import { collectionsApi } from '@/services/api/collections'

// Mock data for development
const MOCK_COLLECTIONS: Collection[] = [
    {
        id: '1',
        name: 'Sample Collection 1',
        projectId: 'project-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        savedWords: []
    },
    {
        id: '2',
        name: 'Sample Collection 2',
        projectId: 'project-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        savedWords: []
    },
]

export const useGetCollectionsQuery = (projectId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['collections', projectId],
        queryFn: () => collectionsApi.listByProject(projectId),
        enabled: !!projectId,
    })

    // If we're still using mock data, replace with this
    // In a real implementation, we'd remove this and use the real API
    return {
        collections: projectId ? MOCK_COLLECTIONS.filter(c => c.projectId === projectId) : [],
        loading: isLoading,
        error,
    }
} 