import { useState } from 'react'
import { Collection } from '@/types'
import { collectionsApi } from '@/services/api/collections'
import type { CreateCollectionRequest } from '@/config/api/types'

interface UseCollectionMutationsReturn {
  loading: boolean
  error: Error | null
  createCollection: (data: CreateCollectionRequest) => Promise<Collection>
  updateCollection: (collectionId: string, data: CreateCollectionRequest) => Promise<Collection>
  deleteCollection: (collectionId: string) => Promise<void>
  bulkUpdateCollections: (collectionIds: string[], name: string) => Promise<Collection[]>
  bulkMoveCollections: (collectionIds: string[], targetProjectId: string) => Promise<Collection[]>
  bulkDeleteCollections: (collectionIds: string[]) => Promise<void>
}

export const useCollectionMutations = (): UseCollectionMutationsReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createCollection = async (data: CreateCollectionRequest) => {
    try {
      setLoading(true)
      setError(null)
      const result = await collectionsApi.create(data)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create collection')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateCollection = async (collectionId: string, data: CreateCollectionRequest) => {
    try {
      setLoading(true)
      setError(null)
      const result = await collectionsApi.update(collectionId, data)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update collection')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteCollection = async (collectionId: string) => {
    try {
      setLoading(true)
      setError(null)
      await collectionsApi.delete(collectionId)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete collection')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const bulkUpdateCollections = async (collectionIds: string[], name: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await collectionsApi.bulkUpdate({ collectionIds, name })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk update collections')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const bulkMoveCollections = async (collectionIds: string[], targetProjectId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await collectionsApi.bulkMove({ collectionIds, targetProjectId })
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk move collections')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const bulkDeleteCollections = async (collectionIds: string[]) => {
    try {
      setLoading(true)
      setError(null)
      await collectionsApi.bulkDelete(collectionIds)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk delete collections')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    bulkUpdateCollections,
    bulkMoveCollections,
    bulkDeleteCollections,
  }
}
