import { useState, useCallback, useRef } from 'react'
import type { KeywordSuggestion } from '@/config/api/types'
import { useSearchHybridCache } from './useSearchHybridCache'

interface StreamingSearchState {
    suggestions: KeywordSuggestion[]
    isLoading: boolean
    isLoadingMore: boolean
    isComplete: boolean
    error: string | null
    progress: number
    canLoadMore: boolean
    loadMoreCount: number
    sessionId: string | null
    isStreaming: boolean
    wasStreaming: boolean
}

export const useStreamingSearch = () => {
    const [state, setState] = useState<StreamingSearchState>({
        suggestions: [],
        isLoading: false,
        isLoadingMore: false,
        isComplete: false,
        error: null,
        progress: 0,
        canLoadMore: true,
        loadMoreCount: 0,
        sessionId: null,
        isStreaming: false,
        wasStreaming: false
    })

    const abortControllerRef = useRef<AbortController | null>(null)
    const { getCachedResult, setCachedResult } = useSearchHybridCache()

    const startSearch = useCallback(async (
        projectId: string,
        query: string,
        searchMode: 'or' | 'and' = 'or'
    ) => {
        // Cancel any existing search
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Check for cached results first
        const cachedResult = getCachedResult(projectId, query, searchMode)

        if (cachedResult?.suggestions && cachedResult.suggestions.length > 0) {
            // Use cached data - no streaming needed
            setState({
                suggestions: cachedResult.suggestions,
                isLoading: false,
                isLoadingMore: false,
                isComplete: true,
                error: null,
                progress: cachedResult.suggestions.length,
                canLoadMore: cachedResult.suggestions.length >= 80,
                loadMoreCount: 0,
                sessionId: null,
                isStreaming: false, // Not currently streaming
                wasStreaming: false // This data came from cache
            })
            return
        }

        // No cached data - start streaming search
        setState(prev => ({
            suggestions: [],
            isLoading: true,
            isLoadingMore: false,
            isComplete: false,
            error: null,
            progress: 0,
            canLoadMore: true,
            loadMoreCount: 0,
            sessionId: null,
            isStreaming: false, // Will be set to true when first suggestion arrives
            wasStreaming: true // This will be streaming data
        }))

        // Create new abort controller
        abortControllerRef.current = new AbortController()

        try {
            const token = localStorage.getItem('token')
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

            const response = await fetch(`${baseUrl}/api/v1/search/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query,
                    project_id: projectId,
                    search_mode: searchMode
                }),
                signal: abortControllerRef.current.signal
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('No response body reader available')
            }

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()

                if (done) break

                buffer += decoder.decode(value, { stream: true })

                // Process complete lines
                const lines = buffer.split('\n')
                buffer = lines.pop() || '' // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))

                            switch (data.type) {
                                case 'status':
                                    if (data.session_id) {
                                        setState(prev => ({
                                            ...prev,
                                            sessionId: data.session_id
                                        }))
                                    }
                                    break

                                case 'suggestion':
                                    setState(prev => ({
                                        ...prev,
                                        isLoading: false,
                                        isStreaming: true,
                                        suggestions: [...prev.suggestions, data.data]
                                    }))
                                    break

                                case 'progress':
                                    setState(prev => ({
                                        ...prev,
                                        progress: data.count
                                    }))
                                    break

                                case 'complete':
                                    setState(prev => {
                                        // Cache the current complete state (including any load more results)
                                        const searchResponse = {
                                            suggestions: prev.suggestions
                                        }
                                        setCachedResult(projectId, query, searchMode, searchResponse)

                                        return {
                                            ...prev,
                                            isLoading: false,
                                            isLoadingMore: false,
                                            isComplete: true,
                                            isStreaming: false, // Streaming is complete
                                            progress: data.total,
                                            canLoadMore: data.total >= 80 // Allow load more if we got a decent batch
                                        }
                                    })
                                    break

                                case 'error':
                                    setState(prev => ({
                                        ...prev,
                                        isLoading: false,
                                        isLoadingMore: false,
                                        error: data.message
                                    }))
                                    break
                            }
                        } catch (parseError) {
                            console.error('Error parsing SSE data:', parseError)
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Search was cancelled, don't update state
                return
            }

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }))
        }
    }, [getCachedResult, setCachedResult])

    const loadMore = useCallback(async (
        projectId: string,
        query: string,
        searchMode: 'or' | 'and' = 'or'
    ) => {
        if (state.isLoadingMore || !state.canLoadMore) return

        // Set loading more state
        setState(prev => ({
            ...prev,
            isLoadingMore: true,
            error: null
        }))

        // Create new abort controller for load more
        abortControllerRef.current = new AbortController()

        try {
            const token = localStorage.getItem('token')
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

            // Prepare request body - include session_id only if we have one
            const requestBody: any = {
                query,
                project_id: projectId,
                search_mode: searchMode,
                is_load_more: true
            }

            // If we have a session, continue it; otherwise start fresh load more
            if (state.sessionId) {
                requestBody.session_id = state.sessionId
            } else {
                // For fresh load more, we need to exclude existing words
                requestBody.exclude_words = state.suggestions.map(s => s.word)
            }

            const response = await fetch(`${baseUrl}/api/v1/search/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
                signal: abortControllerRef.current.signal
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            if (!reader) {
                throw new Error('No response body reader available')
            }

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6))

                            switch (data.type) {
                                case 'status':
                                    // Handle session ID for fresh load more requests
                                    if (data.session_id && !state.sessionId) {
                                        setState(prev => ({
                                            ...prev,
                                            sessionId: data.session_id
                                        }))
                                    }
                                    break

                                case 'suggestion':
                                    setState(prev => ({
                                        ...prev,
                                        suggestions: [...prev.suggestions, data.data]
                                    }))
                                    break

                                case 'complete':
                                    setState(prev => {
                                        // Update cache with the new complete state including load more results
                                        const searchResponse = {
                                            suggestions: prev.suggestions
                                        }
                                        setCachedResult(projectId, query, searchMode, searchResponse)

                                        return {
                                            ...prev,
                                            isLoadingMore: false,
                                            loadMoreCount: prev.loadMoreCount + 1,
                                            canLoadMore: data.total >= 50 && prev.loadMoreCount < 4 // Max 5 loads, need decent batch size
                                        }
                                    })
                                    break

                                case 'error':
                                    setState(prev => ({
                                        ...prev,
                                        isLoadingMore: false,
                                        error: data.message
                                    }))
                                    break
                            }
                        } catch (parseError) {
                            console.error('Error parsing SSE data:', parseError)
                        }
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return
            }

            setState(prev => ({
                ...prev,
                isLoadingMore: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }))
        }
    }, [state.sessionId, state.isLoadingMore, state.canLoadMore])

    const cancelSearch = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            setState(prev => ({
                ...prev,
                isLoading: false,
                isLoadingMore: false
            }))
        }
    }, [])

    return {
        ...state,
        startSearch,
        loadMore,
        cancelSearch
    }
} 