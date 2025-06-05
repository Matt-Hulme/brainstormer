import { useCallback } from 'react'
import type { SearchResponse } from '@/config/api/types'

const DB_NAME = 'brainstormer-cache'
const DB_VERSION = 1
const STORE_NAME = 'search-results'
const CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 hours

interface CachedSearchResult {
    id: string // cache key
    data: SearchResponse
    timestamp: number
    projectId: string
    query: string
    searchMode: string
}

export const useSearchIndexedDBCache = () => {
    const openDB = useCallback((): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                    store.createIndex('timestamp', 'timestamp', { unique: false })
                    store.createIndex('projectId', 'projectId', { unique: false })
                }
            }
        })
    }, [])

    const getCacheKey = useCallback((projectId: string, query: string, searchMode: string) => {
        return `${projectId}-${encodeURIComponent(query)}-${searchMode}`
    }, [])

    const isExpired = useCallback((timestamp: number): boolean => {
        return Date.now() - timestamp > CACHE_DURATION
    }, [])

    const getCachedResult = useCallback(async (
        projectId: string,
        query: string,
        searchMode: string
    ): Promise<SearchResponse | null> => {
        try {
            const db = await openDB()
            const transaction = db.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const cacheKey = getCacheKey(projectId, query, searchMode)

            return new Promise((resolve, reject) => {
                const request = store.get(cacheKey)

                request.onerror = () => reject(request.error)
                request.onsuccess = () => {
                    const result = request.result as CachedSearchResult | undefined

                    if (!result || isExpired(result.timestamp)) {
                        resolve(null)
                        return
                    }

                    resolve(result.data)
                }
            })
        } catch (error) {
            console.error('Error reading from IndexedDB cache:', error)
            return null
        }
    }, [openDB, getCacheKey, isExpired])

    const setCachedResult = useCallback(async (
        projectId: string,
        query: string,
        searchMode: string,
        data: SearchResponse
    ): Promise<void> => {
        try {
            const db = await openDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const cacheKey = getCacheKey(projectId, query, searchMode)

            const cachedResult: CachedSearchResult = {
                id: cacheKey,
                data,
                timestamp: Date.now(),
                projectId,
                query,
                searchMode
            }

            await new Promise<void>((resolve, reject) => {
                const request = store.put(cachedResult)
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve()
            })

            // Clean up expired entries occasionally
            if (Math.random() < 0.1) { // 10% chance
                await cleanupExpired()
            }
        } catch (error) {
            console.error('Error saving to IndexedDB cache:', error)
        }
    }, [openDB, getCacheKey])

    const cleanupExpired = useCallback(async (): Promise<void> => {
        try {
            const db = await openDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const index = store.index('timestamp')

            const cutoffTime = Date.now() - CACHE_DURATION
            const range = IDBKeyRange.upperBound(cutoffTime)

            await new Promise<void>((resolve, reject) => {
                const request = index.openCursor(range)

                request.onerror = () => reject(request.error)
                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result
                    if (cursor) {
                        cursor.delete()
                        cursor.continue()
                    } else {
                        resolve()
                    }
                }
            })
        } catch (error) {
            console.error('Error cleaning up expired cache entries:', error)
        }
    }, [openDB])

    const clearCache = useCallback(async (): Promise<void> => {
        try {
            const db = await openDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)

            await new Promise<void>((resolve, reject) => {
                const request = store.clear()
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve()
            })
        } catch (error) {
            console.error('Error clearing IndexedDB cache:', error)
        }
    }, [openDB])

    const clearProjectCache = useCallback(async (projectId: string): Promise<void> => {
        try {
            const db = await openDB()
            const transaction = db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const index = store.index('projectId')

            await new Promise<void>((resolve, reject) => {
                const request = index.openCursor(IDBKeyRange.only(projectId))

                request.onerror = () => reject(request.error)
                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest).result
                    if (cursor) {
                        cursor.delete()
                        cursor.continue()
                    } else {
                        resolve()
                    }
                }
            })
        } catch (error) {
            console.error('Error clearing project cache:', error)
        }
    }, [openDB])

    return {
        getCachedResult,
        setCachedResult,
        clearCache,
        clearProjectCache
    }
} 