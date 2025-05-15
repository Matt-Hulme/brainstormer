import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'

export const useDeleteProjectMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (projectName: string) => projectsApi.delete(projectName),
        onSuccess: () => {
            // Invalidate the projects list query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })
} 