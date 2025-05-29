import { useState, useCallback, useEffect } from 'react'
import { useSearchQuery } from './useSearchQuery'
import { searchApi } from '@/services/api/search'
import type { KeywordSuggestion } from '@/config/api/types'
import { toast } from 'react-toastify'

export const useSearchWithLoadMore = (
    projectId: string,
    query: string,
    searchMode: 'or' | 'and' = 'or'
) => {
    const [allResults, setAllResults] = useState<KeywordSuggestion[]>([])
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [loadMoreCount, setLoadMoreCount] = useState(0)

    // Initial search query
    const { data: initialData, isLoading, error } = useSearchQuery(projectId, query, searchMode)

    // Reset state when search parameters change
    useEffect(() => {
        setAllResults([])
        setLoadMoreCount(0)
        setIsLoadingMore(false)
    }, [projectId, query, searchMode])

    // Update allResults when initial data comes in
    useEffect(() => {
        if (initialData?.suggestions) {
            setAllResults(initialData.suggestions)
        }
    }, [initialData])

    const loadMore = useCallback(async (excludeWords: string[]) => {
        if (!projectId || !query || isLoadingMore) return

        setIsLoadingMore(true)
        try {
            const result = await searchApi.search({
                projectId,
                query,
                searchMode,
                excludeWords
            })

            if (result.suggestions.length < 10) {
                // If we got fewer than 10 new results, try again with higher temperature
                // This would require backend support for temperature parameter
                console.log('Got fewer than 10 results, might want to retry with higher temp')
            }

            setAllResults(prev => [...prev, ...result.suggestions])
            setLoadMoreCount(prev => prev + 1)
        } catch (error) {
            console.error('Error loading more results:', error)
            toast.error('Failed to load more results')
            throw error
        } finally {
            setIsLoadingMore(false)
        }
    }, [projectId, query, searchMode, isLoadingMore])

    return {
        results: allResults,
        isLoading,
        isLoadingMore,
        error,
        loadMore,
        loadMoreCount,
        canLoadMore: loadMoreCount < 5 // Max 5 load more attempts
    }
} 