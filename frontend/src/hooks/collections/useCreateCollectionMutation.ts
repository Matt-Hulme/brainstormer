import { useMutation, useQueryClient } from '@tanstack/react-query'
import { collectionsApi } from '@/services/api/collections'
import { Collection } from '@/types'
import { CreateCollectionRequest } from '@/config/api/types'
import { toast } from 'react-toastify'

export const useCreateCollectionMutation = () => {
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateCollectionRequest) => {
            const response = await collectionsApi.create(data)
            if (!response?.id) {
                throw new Error('Failed to create collection - no ID returned')
            }
            return response
        },
        onSuccess: () => {
            // Invalidate collections list queries
            queryClient.invalidateQueries({ queryKey: ['collections'] })
        },
        onError: (error: Error) => {
            console.error('Collection creation error:', error)
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