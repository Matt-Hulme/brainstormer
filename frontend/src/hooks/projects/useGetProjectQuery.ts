import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'
import type { Project } from '@/types'

export const useGetProjectQuery = (projectId: string) => {
    const { data, isLoading, error } = useQuery<Project, Error>({
        queryKey: ['project', projectId],
        queryFn: () => projectsApi.get(projectId),
        enabled: !!projectId,
    })

    return {
        project: data,
        isLoading,
        error,
    }
} 