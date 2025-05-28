import { useCallback } from 'react'
import type { SearchResponse } from '@/config/api/types'

const STORAGE_KEY = 'search-results-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedSearchResult {
    data: SearchResponse
    timestamp: number
    projectId: string
    query: string
    searchMode: string
}

interface SearchResultsCache {
    [cacheKey: string]: CachedSearchResult
}

export const useSearchResultsCache = () => {
    const getCacheKey = useCallback((projectId: string, query: string, searchMode: string) => {
        return `${projectId}-${query}-${searchMode}`
    }, [])

    const getCache = useCallback((): SearchResultsCache => {
        try {
            const cached = localStorage.getItem(STORAGE_KEY)
            return cached ? JSON.parse(cached) : {}
        } catch (error) {
            console.error('Error reading search results cache:', error)
            return {}
        }
    }, [])

    const isExpired = useCallback((timestamp: number): boolean => {
        return Date.now() - timestamp > CACHE_DURATION
    }, [])

    const getCachedResult = useCallback((projectId: string, query: string, searchMode: string): SearchResponse | null => {
        if (!projectId || !query) return null

        const cache = getCache()
        const cacheKey = getCacheKey(projectId, query, searchMode)
        const cached = cache[cacheKey]

        if (!cached || isExpired(cached.timestamp)) {
            return null
        }

        return cached.data
    }, [getCache, getCacheKey, isExpired])

    const setCachedResult = useCallback((
        projectId: string,
        query: string,
        searchMode: string,
        data: SearchResponse
    ) => {
        try {
            const cache = getCache()
            const cacheKey = getCacheKey(projectId, query, searchMode)

            cache[cacheKey] = {
                data,
                timestamp: Date.now(),
                projectId,
                query,
                searchMode
            }

            // Clean up expired entries while we're here
            Object.keys(cache).forEach(key => {
                if (isExpired(cache[key].timestamp)) {
                    delete cache[key]
                }
            })

            localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
        } catch (error) {
            console.error('Error saving search results cache:', error)
        }
    }, [getCache, getCacheKey, isExpired])

    const clearCache = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (error) {
            console.error('Error clearing search results cache:', error)
        }
    }, [])

    return {
        getCachedResult,
        setCachedResult,
        clearCache
    }
} 