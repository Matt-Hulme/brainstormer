import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'

export const useDeleteProjectMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (projectId: string) => projectsApi.delete(projectId),
        onSuccess: () => {
            // Invalidate the projects list query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })
} 