import { useCallback } from 'react'
import { SearchTerm } from './SearchTerm'
import { KeywordSuggestion } from '@/config/api/types'
import { toast } from 'react-toastify'
import { Button } from '@/components/design-system/Button'
import { Plus } from 'lucide-react'
import { Spinner } from '@/components/design-system/Spinner'

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
  onLoadMore?: (excludeWords: string[]) => Promise<void>
  isLoadingMore?: boolean
  canLoadMore?: boolean
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
  canLoadMore = false
}: SearchContentProps) => {
  const onSelectWord = useCallback(async (termId: string) => {
    // Get the full word/phrase by removing the match type and index
    const word = termId.split('-').slice(0, -2).join('-')
    try {
      if (!selectedCollectionId && isCreatingCollection) {
        toast.error('Please wait for collection to be created')
        return
      }
      if (!selectedCollectionId) {
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

  const handleLoadMore = async () => {
    if (!onLoadMore || !canLoadMore) return

    const excludeWords = validResults.map(result => result.word)

    try {
      await onLoadMore(excludeWords)
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
          return (
            <SearchTerm
              key={termId}
              isActive={isWordInCollection(result.word)}
              onClick={() => onSelectWord(termId)}
            >
              {result.word}
            </SearchTerm>
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
      {validResults.length > 0 && (canLoadMore || isLoadingMore) && (
        <div className="flex items-center justify-center mt-6">
          {isLoadingMore ? (
            <Button
              variant="outline"
              className="flex items-center gap-1"
              disabled
            >
              <Spinner size="sm" />
              Loading More...
            </Button>
          ) : (
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
