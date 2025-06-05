import { useCallback } from 'react'
import type { SearchResponse } from '@/config/api/types'

const STORAGE_KEY = 'brainstormer-search-cache-v2'
const CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 hours
const MAX_CACHE_SIZE = 50 // Maximum number of cached searches
const STORAGE_QUOTA = 4 * 1024 * 1024 // 4MB soft limit

interface CompactCachedResult {
    d: SearchResponse['suggestions'] // data (suggestions only)
    t: number // timestamp
    p: string // projectId
    q: string // query
    m: string // mode
}

interface SearchCache {
    [key: string]: CompactCachedResult
}

export const useSearchOptimizedCache = () => {
    // Simple compression: store only essential data
    const compressResult = useCallback((data: SearchResponse): SearchResponse['suggestions'] => {
        return data.suggestions || []
    }, [])

    const decompressResult = useCallback((suggestions: SearchResponse['suggestions']): SearchResponse => {
        return { suggestions }
    }, [])

    const getCacheKey = useCallback((projectId: string, query: string, searchMode: string) => {
        // Use shorter keys to save space
        return `${projectId.slice(0, 8)}-${btoa(query).slice(0, 16)}-${searchMode}`
    }, [])

    const getStorageSize = useCallback((): number => {
        try {
            const data = localStorage.getItem(STORAGE_KEY)
            return data ? new Blob([data]).size : 0
        } catch {
            return 0
        }
    }, [])

    const isExpired = useCallback((timestamp: number): boolean => {
        return Date.now() - timestamp > CACHE_DURATION
    }, [])

    const getCache = useCallback((): SearchCache => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY)
            return cached ? JSON.parse(cached) : {}
        } catch (error) {
            console.error('Error reading search cache:', error)
            return {}
        }
    }, [])

    const cleanupCache = useCallback((cache: SearchCache): SearchCache => {
        const now = Date.now()
        const validEntries: [string, CompactCachedResult][] = []

        // Remove expired entries and collect valid ones
        Object.entries(cache).forEach(([key, value]) => {
            if (!isExpired(value.t)) {
                validEntries.push([key, value])
            }
        })

        // Sort by timestamp (newest first) and limit size
        validEntries.sort((a, b) => b[1].t - a[1].t)
        const limitedEntries = validEntries.slice(0, MAX_CACHE_SIZE)

        return Object.fromEntries(limitedEntries)
    }, [isExpired])

    const getCachedResult = useCallback((
        projectId: string,
        query: string,
        searchMode: string
    ): SearchResponse | null => {
        try {
            const cache = getCache()
            const cacheKey = getCacheKey(projectId, query, searchMode)
            const cached = cache[cacheKey]

            if (!cached || isExpired(cached.t)) {
                return null
            }

            return decompressResult(cached.d)
        } catch (error) {
            console.error('Error reading cached result:', error)
            return null
        }
    }, [getCache, getCacheKey, isExpired, decompressResult])

    const setCachedResult = useCallback((
        projectId: string,
        query: string,
        searchMode: string,
        data: SearchResponse
    ): void => {
        try {
            let cache = getCache()
            const cacheKey = getCacheKey(projectId, query, searchMode)

            // Add new result
            cache[cacheKey] = {
                d: compressResult(data),
                t: Date.now(),
                p: projectId,
                q: query,
                m: searchMode
            }

            // Clean up before saving
            cache = cleanupCache(cache)

            // Check storage size
            const cacheString = JSON.stringify(cache)
            if (new Blob([cacheString]).size > STORAGE_QUOTA) {
                console.warn('Cache size limit reached, clearing old entries')
                // Keep only the newest 25 entries
                const entries = Object.entries(cache)
                entries.sort((a, b) => b[1].t - a[1].t)
                cache = Object.fromEntries(entries.slice(0, 25))
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.warn('Storage quota exceeded, clearing cache')
                clearCache()
            } else {
                console.error('Error saving cached result:', error)
            }
        }
    }, [getCache, getCacheKey, compressResult, cleanupCache])

    const clearCache = useCallback((): void => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (error) {
            console.error('Error clearing cache:', error)
        }
    }, [])

    const clearProjectCache = useCallback((projectId: string): void => {
        try {
            const cache = getCache()
            const filteredCache: SearchCache = {}

            Object.entries(cache).forEach(([key, value]) => {
                if (value.p !== projectId) {
                    filteredCache[key] = value
                }
            })

            localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCache))
        } catch (error) {
            console.error('Error clearing project cache:', error)
        }
    }, [getCache])

    const getCacheStats = useCallback(() => {
        const cache = getCache()
        const entries = Object.values(cache)
        const storageSize = getStorageSize()

        return {
            totalEntries: entries.length,
            expiredEntries: entries.filter(entry => isExpired(entry.t)).length,
            storageSize: `${(storageSize / 1024).toFixed(1)}KB`,
            oldestEntry: entries.length > 0 ? new Date(Math.min(...entries.map(e => e.t))) : null,
            newestEntry: entries.length > 0 ? new Date(Math.max(...entries.map(e => e.t))) : null,
        }
    }, [getCache, getStorageSize, isExpired])

    return {
        getCachedResult,
        setCachedResult,
        clearCache,
        clearProjectCache,
        getCacheStats
    }
} 