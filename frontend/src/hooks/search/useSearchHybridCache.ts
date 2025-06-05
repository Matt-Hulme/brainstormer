import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { SearchResponse } from '@/config/api/types'

const SESSION_STORAGE_KEY = 'brainstormer-search-session'
const CACHE_DURATION = Infinity
const MAX_CACHE_ENTRIES = 500 // Prevent unlimited growth
const STORAGE_QUOTA_THRESHOLD = 0.8 // Clear cache when 80% full

interface SessionCacheEntry {
    data: SearchResponse
    timestamp: number
    queryKey: string[]
}

interface SessionCache {
    [key: string]: SessionCacheEntry
}

export const useSearchHybridCache = () => {
    const queryClient = useQueryClient()

    const getQueryKey = useCallback((projectId: string, query: string, searchMode: string) => {
        return ['search', projectId, query, searchMode]
    }, [])

    const getSessionCacheKey = useCallback((projectId: string, query: string, searchMode: string) => {
        return `${projectId}-${query}-${searchMode}`
    }, [])

    const isExpired = useCallback((timestamp: number): boolean => {
        // Never expire - cache indefinitely
        return false
    }, [])

    const getSessionCache = useCallback((): SessionCache => {
        try {
            const cached = sessionStorage.getItem(SESSION_STORAGE_KEY)
            return cached ? JSON.parse(cached) : {}
        } catch (error) {
            console.error('Error reading session cache:', error)
            return {}
        }
    }, [])

    const getStorageInfo = useCallback(() => {
        try {
            // Get current storage usage
            const used = JSON.stringify(getSessionCache()).length
            const total = 10 * 1024 * 1024 // Assume 10MB limit for sessionStorage

            return {
                used,
                total,
                percentage: used / total,
                remaining: total - used
            }
        } catch (error) {
            return { used: 0, total: 0, percentage: 0, remaining: 0 }
        }
    }, [])

    const cleanupOldestEntries = useCallback((cache: SessionCache, keepCount: number): SessionCache => {
        const entries = Object.entries(cache)

        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

        // Keep only the newest entries
        const keptEntries = entries.slice(-keepCount)

        console.log(`🧹 Cleaned up cache: ${entries.length} → ${keptEntries.length} entries`)

        return Object.fromEntries(keptEntries)
    }, [])

    const setSessionCache = useCallback((cache: SessionCache): void => {
        try {
            // Check cache size limits
            const entryCount = Object.keys(cache).length
            if (entryCount > MAX_CACHE_ENTRIES) {
                console.warn(`Cache has ${entryCount} entries, cleaning up to ${MAX_CACHE_ENTRIES}`)
                cache = cleanupOldestEntries(cache, MAX_CACHE_ENTRIES)
            }

            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cache))
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.warn('🚨 Storage quota exceeded, cleaning up cache')

                // Aggressive cleanup - keep only 25% of entries
                const targetSize = Math.floor(MAX_CACHE_ENTRIES * 0.25)
                const cleanedCache = cleanupOldestEntries(cache, targetSize)

                try {
                    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cleanedCache))
                    console.log(`✅ Cache cleaned up to ${targetSize} entries`)
                } catch (retryError) {
                    console.error('❌ Failed to save even after cleanup, clearing all cache')
                    sessionStorage.removeItem(SESSION_STORAGE_KEY)
                }
            } else {
                console.error('Error saving session cache:', error)
            }
        }
    }, [cleanupOldestEntries])

    const getCachedResult = useCallback((
        projectId: string,
        query: string,
        searchMode: string
    ): SearchResponse | null => {
        const queryKey = getQueryKey(projectId, query, searchMode)

        // First check React Query cache (in-memory, fastest)
        const reactQueryData = queryClient.getQueryData<SearchResponse>(queryKey)
        if (reactQueryData) {
            console.log('🚀 Cache HIT: React Query (in-memory)')
            return reactQueryData
        }

        // Fall back to sessionStorage
        try {
            const sessionCache = getSessionCache()
            const cacheKey = getSessionCacheKey(projectId, query, searchMode)
            const sessionEntry = sessionCache[cacheKey]

            if (sessionEntry && !isExpired(sessionEntry.timestamp)) {
                console.log('💾 Cache HIT: SessionStorage')

                // Restore to React Query cache for faster future access
                queryClient.setQueryData(queryKey, sessionEntry.data, {
                    updatedAt: sessionEntry.timestamp
                })

                return sessionEntry.data
            }
        } catch (error) {
            console.error('Error reading session cache:', error)
        }

        console.log('❌ Cache MISS: No cached data found')
        return null
    }, [queryClient, getQueryKey, getSessionCacheKey, getSessionCache, isExpired])

    const setCachedResult = useCallback((
        projectId: string,
        query: string,
        searchMode: string,
        data: SearchResponse
    ): void => {
        const queryKey = getQueryKey(projectId, query, searchMode)
        const timestamp = Date.now()

        // Set in React Query cache (in-memory)
        queryClient.setQueryData(queryKey, data, {
            updatedAt: timestamp
        })

        // Also save to sessionStorage for persistence across page reloads within session
        try {
            const sessionCache = getSessionCache()
            const cacheKey = getSessionCacheKey(projectId, query, searchMode)

            sessionCache[cacheKey] = {
                data,
                timestamp,
                queryKey
            }

            // No automatic cleanup - cache indefinitely

            setSessionCache(sessionCache)
            console.log('✅ Cached in both React Query and SessionStorage')
        } catch (error) {
            console.error('Error saving to session cache:', error)
        }
    }, [queryClient, getQueryKey, getSessionCacheKey, getSessionCache, setSessionCache, isExpired])

    const clearCache = useCallback((): void => {
        // Clear React Query cache for search queries
        queryClient.removeQueries({
            queryKey: ['search'],
            exact: false
        })

        // Clear sessionStorage
        try {
            sessionStorage.removeItem(SESSION_STORAGE_KEY)
            console.log('🗑️ Cleared all search caches')
        } catch (error) {
            console.error('Error clearing session cache:', error)
        }
    }, [queryClient])

    const clearProjectCache = useCallback((projectId: string): void => {
        // Clear React Query cache for specific project
        queryClient.removeQueries({
            queryKey: ['search', projectId],
            exact: false
        })

        // Clear sessionStorage for specific project
        try {
            const sessionCache = getSessionCache()
            const filteredCache: SessionCache = {}

            Object.entries(sessionCache).forEach(([key, value]) => {
                if (!value.queryKey.includes(projectId)) {
                    filteredCache[key] = value
                }
            })

            setSessionCache(filteredCache)
            console.log(`🗑️ Cleared cache for project: ${projectId}`)
        } catch (error) {
            console.error('Error clearing project session cache:', error)
        }
    }, [queryClient, getSessionCache, setSessionCache])

    const prefetchSearch = useCallback(async (
        projectId: string,
        query: string,
        searchMode: string,
        fetchFn: () => Promise<SearchResponse>
    ): Promise<void> => {
        const queryKey = getQueryKey(projectId, query, searchMode)

        await queryClient.prefetchQuery({
            queryKey,
            queryFn: fetchFn,
            staleTime: CACHE_DURATION,
        })
    }, [queryClient, getQueryKey])

    const invalidateSearch = useCallback((projectId?: string): void => {
        if (projectId) {
            queryClient.invalidateQueries({
                queryKey: ['search', projectId],
                exact: false
            })
        } else {
            queryClient.invalidateQueries({
                queryKey: ['search'],
                exact: false
            })
        }
    }, [queryClient])

    const clearSearchCache = useCallback((projectId: string, query: string, searchMode: string): void => {
        // Clear from React Query cache
        const queryKey = getQueryKey(projectId, query, searchMode)
        queryClient.removeQueries({ queryKey, exact: true })

        // Clear from sessionStorage
        try {
            const sessionCache = getSessionCache()
            const cacheKey = getSessionCacheKey(projectId, query, searchMode)
            delete sessionCache[cacheKey]
            setSessionCache(sessionCache)
            console.log(`🗑️ Cleared cache for specific search: ${query}`)
        } catch (error) {
            console.error('Error clearing specific search cache:', error)
        }
    }, [queryClient, getQueryKey, getSessionCacheKey, getSessionCache, setSessionCache])

    const getCacheStats = useCallback(() => {
        const sessionCache = getSessionCache()
        const entries = Object.values(sessionCache)
        const reactQueryCache = queryClient.getQueryCache()
        const searchQueries = reactQueryCache.findAll({ queryKey: ['search'] })
        const storageInfo = getStorageInfo()

        return {
            sessionEntries: entries.length,
            sessionExpired: 0, // Never expire with current settings
            reactQueryEntries: searchQueries.length,
            totalQueries: reactQueryCache.getAll().length,
            storageUsed: `${(storageInfo.used / 1024).toFixed(1)}KB`,
            storagePercentage: `${(storageInfo.percentage * 100).toFixed(1)}%`,
        }
    }, [queryClient, getSessionCache, isExpired, getStorageInfo])

    return {
        getCachedResult,
        setCachedResult,
        clearCache,
        clearProjectCache,
        clearSearchCache,
        prefetchSearch,
        invalidateSearch,
        getCacheStats,
        getStorageInfo
    }
} 