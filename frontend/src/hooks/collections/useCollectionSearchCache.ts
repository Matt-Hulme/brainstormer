import { useCallback } from 'react'

const STORAGE_KEY = 'collection-search-cache'

interface CollectionSearchCache {
    [collectionId: string]: string
}

export const useCollectionSearchCache = () => {
    const getCache = useCallback((): CollectionSearchCache => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY)
            return cached ? JSON.parse(cached) : {}
        } catch (error) {
            console.error('Error reading collection search cache:', error)
            return {}
        }
    }, [])

    const getLastSearch = useCallback((collectionId: string): string | null => {
        const cache = getCache()
        return cache[collectionId] || null
    }, [getCache])

    const setLastSearch = useCallback((collectionId: string, searchQuery: string) => {
        try {
            const cache = getCache()
            cache[collectionId] = searchQuery
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
        } catch (error) {
            console.error('Error saving collection search cache:', error)
        }
    }, [getCache])

    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (error) {
            console.error('Error clearing collection search cache:', error)
        }
    }, [])

    const removeCollectionCache = useCallback((collectionId: string) => {
        try {
            const cache = getCache()
            delete cache[collectionId]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
        } catch (error) {
            console.error('Error removing collection from cache:', error)
        }
    }, [getCache])

    return {
        getLastSearch,
        setLastSearch,
        clearCache,
        removeCollectionCache
    }
} 