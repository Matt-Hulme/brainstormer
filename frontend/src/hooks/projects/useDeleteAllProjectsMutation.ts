import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'

export const useDeleteAllProjectsMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => projectsApi.deleteAll(),
        onSuccess: () => {
            // Invalidate the projects list query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        }
    })
} 