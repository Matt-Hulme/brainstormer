import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { toast } from 'react-toastify'
import { Collection } from '@/types'

export const useRemoveWordFromCollectionMutation = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (params: { word: string, collectionId: string }) =>
            collectionsApi.removeWord(params.collectionId, params.word),
        onSuccess: async (updatedCollection: Collection, variables) => {
            // Ensure savedWords is always an array
            const collectionWithWords = {
                ...updatedCollection,
                savedWords: updatedCollection.savedWords || []
            }

            // Get the project ID from the updated collection
            const projectId = updatedCollection.projectId

            // Update the specific collection in the cache
            queryClient.setQueryData(
                ['collection', variables.collectionId],
                collectionWithWords
            )

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

            // Update the project cache to reflect the collection changes
            queryClient.setQueryData(
                ['project', projectId],
                (oldData: any) => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        collections: oldData.collections?.map((collection: Collection) =>
                            collection.id === variables.collectionId
                                ? collectionWithWords
                                : collection
                        )
                    }
                }
            )
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