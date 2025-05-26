import { useCallback } from 'react'
import { SearchTerm } from './SearchTerm'
import { KeywordSuggestion } from '@/config/api/types'
import { Project, Collection } from '@/types'
import { toast } from 'react-toastify'

interface SearchContentProps {
  projectId: string
  results: KeywordSuggestion[]
  project?: Project
  collections?: Collection[]
  selectedCollectionId: string | null
  isCreatingCollection: boolean
  onAddWord: (word: string, collectionId: string) => Promise<void>
  onRemoveWord: (word: string, collectionId: string) => Promise<void>
}

export const SearchContent = ({
  projectId,
  results = [],
  project,
  collections = [],
  selectedCollectionId,
  isCreatingCollection,
  onAddWord,
  onRemoveWord
}: SearchContentProps) => {

  const onSelectWord = useCallback(async (termId: string) => {
    const word = termId.split('-')[0]
    try {
      if (!selectedCollectionId && isCreatingCollection) {
        toast.error('Please wait for collection to be created')
        return
      }
      if (!selectedCollectionId) {
        return
      }
      await onAddWord(word, selectedCollectionId)
    } catch (error) {
      console.error('Error adding word to collection:', error)
      toast.error('Failed to add word to collection')
    }
  }, [selectedCollectionId, isCreatingCollection, onAddWord])

  // Group results by match type for efficient rendering
  const groupedResults = results.reduce((acc, result) => {
    const matchType = result.matchType ?? 'or'
    if (!acc[matchType]) {
      acc[matchType] = []
    }
    acc[matchType].push(result)
    return acc
  }, {} as Record<string, KeywordSuggestion[]>) ?? {}

  // Check if we have multiple match types
  const hasMultipleMatchTypes = Object.keys(groupedResults).length > 1

  // Find the selected collection
  const selectedCollection = collections?.find(c => c?.id === selectedCollectionId)

  // Check if a word is in the selected collection
  const isWordInCollection = (word: string) => {
    return selectedCollection?.savedWords?.some(sw => sw.word === word) ?? false
  }

  return (
    <div className="pb-[35px]">
      {/* Show AND matches first if they exist */}
      {groupedResults['and']?.length > 0 && (
        <div className="mb-8">
          {hasMultipleMatchTypes && (
            <div className="ml-[20px] mb-3">
              <h3 className="text-primary-1 font-semibold mb-1">Strong Matches (ALL Phrases)</h3>
              <p className="text-xs text-secondary-3 mb-2">
                These words connect to <strong>all</strong> of your search phrases
              </p>
            </div>
          )}
          <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
            {groupedResults['and'].map((result, index) => {
              if (!result?.word) return null
              const termId = `${result.word}-and-${index}`
              return (
                <SearchTerm
                  key={termId}
                  isActive={isWordInCollection(result.word)}
                  onClick={() => onSelectWord(termId)}
                  matchType="and"
                >
                  {result.word}
                </SearchTerm>
              )
            })}
          </div>
        </div>
      )}

      {/* Then show OR matches */}
      {groupedResults['or']?.length > 0 && (
        <div>
          {hasMultipleMatchTypes && (
            <div className="ml-[20px] mb-3">
              <h3 className="text-secondary-4 font-semibold mb-1">General Matches (ANY Phrase)</h3>
              <p className="text-xs text-secondary-3 mb-2">
                These words connect to <strong>at least one</strong> of your search phrases
              </p>
            </div>
          )}
          <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
            {groupedResults['or'].map((result, index) => {
              if (!result?.word) return null
              const termId = `${result.word}-or-${index}`
              return (
                <SearchTerm
                  key={termId}
                  isActive={isWordInCollection(result.word)}
                  onClick={() => onSelectWord(termId)}
                  matchType="or"
                >
                  {result.word}
                </SearchTerm>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
