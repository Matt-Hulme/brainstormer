import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { Collection } from '@/types'
import { CreateCollectionRequest } from '@/config/api/types'
import { toast } from 'react-toastify'

export const useCreateCollectionMutation = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (data: CreateCollectionRequest) => collectionsApi.create(data),
        onSuccess: (newCollection) => {
            // Invalidate collections list queries
            queryClient.invalidateQueries({ queryKey: ['collections'] })
            toast.success('Collection created')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create collection')
        }
    })

    return {
        createCollection: async (data: CreateCollectionRequest): Promise<Collection> => {
            return new Promise((resolve, reject) => {
                mutate(data, {
                    onSuccess: (data) => resolve(data),
                    onError: (error) => reject(error)
                })
            })
        },
        loading: isPending,
    }
} 