import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { toast } from 'react-toastify'
import { Collection } from '@/types'

export const useAddWordToCollectionMutation = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (params: { word: string, collectionId: string }) =>
            collectionsApi.addWord(params.collectionId, params.word),
        onSuccess: (updatedCollection: Collection, variables) => {
            // Ensure savedWords is always an array
            const collectionWithWords = {
                ...updatedCollection,
                savedWords: updatedCollection.savedWords || []
            }

            // Update the specific collection in the cache
            queryClient.setQueryData(
                ['collection', variables.collectionId],
                collectionWithWords
            )

            // Get the project ID from the updated collection
            const projectId = updatedCollection.projectId

            // Update the collections list in the cache
            queryClient.setQueryData(
                ['collections', projectId],
                (oldData: Collection[] | undefined) => {
                    if (!oldData) return [collectionWithWords]
                    return oldData.map(collection =>
                        collection.id === variables.collectionId
                            ? collectionWithWords
                            : collection
                    )
                }
            )
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