import { CollectionsSidebar } from './CollectionsSidebar'
import { useState, useCallback, useEffect } from 'react'
import { SearchTerm } from './SearchTerm'
import { KeywordSuggestion } from '@/config/api/types'
import { Project } from '@/types'
import { useAddWordToCollectionMutation, useRemoveWordFromCollectionMutation, useCreateCollectionMutation } from '@/hooks'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'

interface SearchContentProps {
  projectId: string
  results: KeywordSuggestion[]
  project?: Project
}

export const SearchContent = ({ projectId, results, project }: SearchContentProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const { addWordToCollection, loading: addWordLoading } = useAddWordToCollectionMutation()
  const { removeWordFromCollection, loading: removeWordLoading } = useRemoveWordFromCollectionMutation()
  const { createCollection, loading: createCollectionLoading } = useCreateCollectionMutation()

  // Create a collection when search is performed
  useEffect(() => {
    const createSearchCollection = async () => {
      if (!searchQuery || !projectId || !project) return

      try {
        const collection = await createCollection({
          name: searchQuery,
          projectId
        })
        setSelectedCollectionId(collection.id)
      } catch (error: any) {
        console.error('Error creating collection:', error)
        // Show the specific error message from the backend if available
        const errorMessage = error.response?.data?.detail || 'Failed to create collection'
        toast.error(errorMessage)
      }
    }

    createSearchCollection()
  }, [searchQuery, projectId, project])

  const onSelectWord = useCallback(async (termId: string) => {
    const word = termId.split('-')[0]
    try {
      if (!selectedCollectionId) {
        toast.error('Please wait for collection to be created')
        return
      }
      await addWordToCollection(word, selectedCollectionId)
    } catch (error) {
      console.error('Error adding word to collection:', error)
      toast.error('Failed to add word to collection')
    }
  }, [selectedCollectionId, addWordToCollection])

  const onUnselectWord = useCallback(async (termId: string) => {
    const word = termId.split('-')[0]
    try {
      if (!selectedCollectionId) {
        toast.error('Please wait for collection to be created')
        return
      }
      await removeWordFromCollection(word, selectedCollectionId)
    } catch (error) {
      console.error('Error removing word from collection:', error)
      toast.error('Failed to remove word from collection')
    }
  }, [selectedCollectionId, removeWordFromCollection])

  // Group results by match type for efficient rendering
  const groupedResults = results.reduce((acc, result) => {
    const matchType = result.matchType ?? 'or'
    if (!acc[matchType]) {
      acc[matchType] = []
    }
    acc[matchType].push(result)
    return acc
  }, {} as Record<string, KeywordSuggestion[]>)

  // Check if we have multiple match types
  const hasMultipleMatchTypes = Object.keys(groupedResults).length > 1

  return (
    <div className="flex flex-row pt-[25px]">
      <main className="flex-1 pb-[35px]">
        {/* Show AND matches first if they exist */}
        {groupedResults['and'] && (
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
                const termId = `${result.word}-and-${index}`
                return (
                  <SearchTerm
                    key={termId}
                    isActive={false}
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
        {groupedResults['or'] && (
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
                const termId = `${result.word}-or-${index}`
                return (
                  <SearchTerm
                    key={termId}
                    isActive={false}
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
      </main>
      <aside className="ml-5">
        <CollectionsSidebar
          projectId={projectId}
          activeWords={[]}
          onRemoveWord={onUnselectWord}
          project={project}
          onCollectionSelect={setSelectedCollectionId}
        />
      </aside>
    </div>
  )
}
