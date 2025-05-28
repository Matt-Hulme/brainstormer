import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { toast } from 'react-toastify'

export const useDeleteCollectionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (collectionId: string) => collectionsApi.delete(collectionId),
        onSuccess: () => {
            // Invalidate collections queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['collections'] })

            // Also invalidate project queries since they contain collection data
            queryClient.invalidateQueries({ queryKey: ['project'] })

            toast.success('Collection deleted successfully')
        },
        onError: (error: Error) => {
            console.error('Error deleting collection:', error)
            toast.error(error.message || 'Failed to delete collection')
        }
    })
} 