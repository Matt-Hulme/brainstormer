import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { toast } from 'react-toastify'

export const useAddWordToCollectionMutation = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (params: { word: string, collectionId: string }) =>
            collectionsApi.addWord(params.collectionId, params.word),
        onSuccess: (_, variables) => {
            // Invalidate the specific collection query
            queryClient.invalidateQueries({ queryKey: ['collection', variables.collectionId] })
            // Invalidate collections list for the project
            queryClient.invalidateQueries({ queryKey: ['collections'] })
            toast.success('Word saved successfully')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save word')
        }
    })

    return {
        addWordToCollection: (word: string, collectionId: string) =>
            mutate({ word, collectionId }),
        loading: isPending
    }
} 