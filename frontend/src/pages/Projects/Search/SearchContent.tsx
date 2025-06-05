import { useCallback, useState, useEffect } from 'react'
import { Button, Spinner } from '@/components'
import { SearchResult } from './SearchResult'
import { KeywordSuggestion } from '@/config/api/types'
import { toast } from 'react-toastify'
import { Plus } from 'lucide-react'

interface SearchContentProps {
  results: KeywordSuggestion[]
  selectedCollectionId: string | null
  isCreatingCollection: boolean
  onAddWord: (word: string, collectionId: string) => Promise<void>
  onRemoveWord: (word: string, collectionId: string) => Promise<void>
  localActiveWords: Set<string>
  searchMode: 'or' | 'and'
  hasMultiplePhrases: boolean
  error?: boolean
  onLoadMore?: () => Promise<void>
  isLoadingMore?: boolean
  canLoadMore?: boolean
  isComplete?: boolean
  wasStreaming?: boolean
}

export const SearchContent = ({
  results = [],
  selectedCollectionId,
  isCreatingCollection,
  onAddWord,
  onRemoveWord,
  localActiveWords,
  searchMode,
  hasMultiplePhrases,
  error = false,
  onLoadMore,
  isLoadingMore = false,
  canLoadMore = false,
  isComplete = false,
  wasStreaming = true
}: SearchContentProps) => {
  const [initialResultsLength, setInitialResultsLength] = useState(0)
  const [animationsCompleted, setAnimationsCompleted] = useState(0)

  // Track initial results length when first results arrive
  useEffect(() => {
    if (results.length > 0 && initialResultsLength === 0) {
      setInitialResultsLength(results.length)
    }
  }, [results.length, initialResultsLength])

  // Reset counters when search changes

  useEffect(() => {
    if (results.length === 0) {
      setInitialResultsLength(0)
      setAnimationsCompleted(0)
    }
  }, [results.length])

  // For cached data, mark all animations as complete immediately
  useEffect(() => {
    if (!wasStreaming) {
      setAnimationsCompleted(results.length)
    }
  }, [wasStreaming, results.length])

  const onAnimationComplete = useCallback(() => {
    setAnimationsCompleted(prev => prev + 1)
  }, [])

  const onSelectWord = useCallback(async (word: string) => {
    try {
      if (!selectedCollectionId && isCreatingCollection) {
        toast.error('Please wait for collection to be created')
        return
      }
      if (!selectedCollectionId) {
        toast.error('No collection selected. Create a collection by searching for a topic.')
        return
      }

      // If word is already in collection, remove it
      if (localActiveWords.has(word)) {
        await onRemoveWord(word, selectedCollectionId)
        return
      }

      // Otherwise add it
      await onAddWord(word, selectedCollectionId)
    } catch (error) {
      console.error('Error updating word in collection:', error)
      toast.error('Failed to update word in collection')
    }
  }, [selectedCollectionId, isCreatingCollection, onAddWord, onRemoveWord, localActiveWords])

  // Check if a word is in the selected collection (using local state)
  const isWordInCollection = (word: string) => {
    return localActiveWords?.has(word)
  }

  // Filter out error messages that might be returned as suggestions
  const validResults = results.filter(result => {
    if (!result?.word) return false
    // Filter out any suggestions that look like error messages
    const word = result.word.toLowerCase()
    return !word.includes('sorry') &&
      !word.includes('need the specific concepts') &&
      !word.includes('please provide') &&
      !word.startsWith('i ') &&
      word.length <= 100 // Reasonable length for keywords
  })

  // Show LoadMore button when we have results and can load more
  const shouldShowLoadMore = validResults.length > 0 && canLoadMore

  // Button should be enabled when:
  // 1. Not currently loading more
  // 2. Initial search is complete 
  // 3. All current animations are done (for streaming data)
  const shouldEnableLoadMore = !isLoadingMore && isComplete &&
    (wasStreaming ? animationsCompleted >= validResults.length : true)

  // Show loading state when:
  // 1. Currently loading more, OR
  // 2. New results arrived but animations aren't complete yet
  const shouldShowLoadingState = isLoadingMore ||
    (wasStreaming && animationsCompleted < validResults.length && validResults.length > initialResultsLength)



  const handleLoadMore = async () => {
    if (!onLoadMore || !canLoadMore || !shouldEnableLoadMore) return

    try {
      await onLoadMore()
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full color-red">
        Failed to load search results
      </div>
    )
  }

  return (
    <div className="pb-[35px] space-y-6">
      {/* Results */}
      <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
        {validResults.map((result, index) => {
          const termId = `${result.word}-${searchMode}-${index}`

          // For LoadMore results, calculate stagger index relative to when they were added
          // This prevents huge delays for results loaded later
          const isLoadMoreResult = index >= initialResultsLength
          const relativeStaggerIndex = isLoadMoreResult ? (index - initialResultsLength) : index

          return (
            <SearchResult
              key={termId}
              isActive={isWordInCollection(result.word)}
              onClick={() => onSelectWord(result.word)}
              onAnimationComplete={onAnimationComplete}
              skipAnimation={!wasStreaming}
              staggerIndex={relativeStaggerIndex}
            >
              {result.word}
            </SearchResult>
          )
        })}
      </div>

      {/* No results state */}
      {validResults.length === 0 && !isLoadingMore && (
        <div className="text-center py-8 color-secondary-3">
          <p>No results found.</p>
          {searchMode === 'and' && hasMultiplePhrases && (
            <p className="text-sm mt-2">Try switching to "OR" mode for more results.</p>
          )}
        </div>
      )}

      {/* Load More button */}
      {shouldShowLoadMore && (
        <div className="flex items-center justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="flex items-center gap-1"
            disabled={!shouldEnableLoadMore}
          >
            {shouldShowLoadingState ? (
              <>
                <Spinner size="sm" />
                Loading More...
              </>
            ) : (
              <>
                <Plus size={16} />
                Load More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
