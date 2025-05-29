import { useCallback } from 'react'
import { SearchTerm } from './SearchTerm'
import { KeywordSuggestion } from '@/config/api/types'
import { toast } from 'react-toastify'

interface SearchContentProps {
  results: KeywordSuggestion[]
  selectedCollectionId: string | null
  isCreatingCollection: boolean
  onAddWord: (word: string, collectionId: string) => Promise<void>
  onRemoveWord: (word: string, collectionId: string) => Promise<void>
  localActiveWords: Set<string>
  searchMode: 'or' | 'and'
  hasMultiplePhrases: boolean
}

export const SearchContent = ({
  results = [],
  selectedCollectionId,
  isCreatingCollection,
  onAddWord,
  onRemoveWord,
  localActiveWords,
  searchMode,
  hasMultiplePhrases
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

  // Filter results based on current search mode
  // Handle cases where matchType might be null/undefined (treat as 'or')
  const filteredResults = results.filter(result => {
    const resultMatchType = result.matchType || 'or'
    return resultMatchType === searchMode
  })

  // Check if a word is in the selected collection (using local state)
  const isWordInCollection = (word: string) => {
    return localActiveWords?.has(word)
  }

  return (
    <div className="pb-[35px] space-y-6">
      {/* Results */}
      <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
        {filteredResults.map((result, index) => {
          if (!result?.word) return null
          const termId = `${result.word}-${searchMode}-${index}`
          return (
            <SearchTerm
              key={termId}
              isActive={isWordInCollection(result.word)}
              onClick={() => onSelectWord(termId)}
              matchType={searchMode}
            >
              {result.word}
            </SearchTerm>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredResults.length === 0 && (
        <div className="text-center py-8 color-secondary-3">
          <p>No {searchMode === 'and' ? 'AND' : 'OR'} matches found.</p>
          {searchMode === 'and' && hasMultiplePhrases && (
            <p className="text-sm mt-2">Try switching to "OR" mode for more results.</p>
          )}
        </div>
      )}
    </div>
  )
}
