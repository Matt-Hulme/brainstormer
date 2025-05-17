import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'
import type { Project } from '@/types'

export const useGetProjectQuery = (projectName: string) => {
    const { data, isLoading, error } = useQuery<Project, Error>({
        queryKey: ['project', projectName],
        queryFn: () => projectsApi.get(projectName),
        enabled: !!projectName,
    })

    return {
        project: data,
        isLoading,
        error,
    }
} 