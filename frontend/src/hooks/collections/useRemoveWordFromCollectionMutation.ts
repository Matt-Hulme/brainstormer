import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { toast } from 'react-toastify'

export const useRemoveWordFromCollectionMutation = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (params: { word: string, collectionId: string }) =>
            collectionsApi.removeWord(params.collectionId, params.word),
        onSuccess: (_, variables) => {
            // Invalidate the specific collection query
            queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] })
            // Invalidate collections list for the project
            queryClient.invalidateQueries({ queryKey: ['collections'] })
            toast.success('Word removed successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to remove word')
        }
    })

    return {
        removeWordFromCollection: (word: string, collectionId: string) =>
            mutate({ word, collectionId }),
        loading: isPending
    }
} 