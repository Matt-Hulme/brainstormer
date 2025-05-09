import { useState, useEffect } from 'react'
import { Collection } from '@/types'
import { collectionsApi } from '@/services/api/collections'

interface UseGetCollectionsQueryReturn {
  collections: Collection[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useGetCollectionsQuery = (projectId: string): UseGetCollectionsQueryReturn => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCollections = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await collectionsApi.listByProject(projectId)
      setCollections(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchCollections()
    }
  }, [projectId])

  return {
    collections,
    loading,
    error,
    refetch: fetchCollections,
  }
}
