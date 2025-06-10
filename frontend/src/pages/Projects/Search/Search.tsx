import { SearchContentLoading } from './SearchContentLoading'
import { SearchContent } from './SearchContent'
import { SearchContentEmpty } from './SearchContentEmpty'
import { CollectionsSidebar } from './CollectionsSidebar'
import { Toggle } from '@/components'
import { useSearchBarContext } from '@/components'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { useGetProjectQuery, useGetCollectionsQuery, useAddWordToCollectionMutation, useRemoveWordFromCollectionMutation, useCreateCollectionMutation, useCollectionSearchCache } from '@/hooks'
import { useStreamingSearch } from '@/hooks/search/useStreamingSearch'
import { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { toast } from 'react-toastify'

export const Search = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearAndFocusSearchBar } = useSearchBarContext()
  const searchValue = searchParams.get('q') ?? ''
  const searchMode = searchParams.get('mode') as 'or' | 'and' ?? 'or'
  const collectionParam = searchParams.get('collection')
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const lastAttemptedSearch = useRef<string | null>(null)
  const lastAttemptedSearchMode = useRef<'or' | 'and' | null>(null)
  const lastSuccessfullyCreatedCollection = useRef<string | null>(null)
  const { suggestions: results, isLoading: searchLoading, isLoadingMore, isComplete, isStreaming, wasStreaming, error: searchError, startSearch, loadMore, canLoadMore } = useStreamingSearch()
  const { project, isLoading: projectLoading } = useGetProjectQuery(projectId ?? '')
  const { collections, loading: collectionsLoading } = useGetCollectionsQuery(projectId ?? '')
  const { addWordToCollection } = useAddWordToCollectionMutation()
  const { removeWordFromCollection } = useRemoveWordFromCollectionMutation()
  const { createCollection } = useCreateCollectionMutation()
  const { setLastSearch } = useCollectionSearchCache()

  // Local state for optimistic updates
  const [localCollections, setLocalCollections] = useState<Record<string, Set<string>>>({})

  // Initialize local state from collections data only once when collections first load
  useEffect(() => {
    if (collections && collections.length > 0) {
      setLocalCollections(prev => {
        // Only initialize if we don't have any collections yet
        if (Object.keys(prev).length === 0) {
          const initialCollections: Record<string, Set<string>> = {}
          collections.forEach(collection => {
            initialCollections[collection.id] = new Set(collection.savedWords?.map(sw => sw.word) || [])
          })
          return initialCollections
        }
        return prev
      })
    }
  }, [collections])

  // Cache search query when a collection is selected and search value changes
  useEffect(() => {
    if (selectedCollectionId && searchValue) {
      setLastSearch(selectedCollectionId, searchValue)
    }
  }, [selectedCollectionId, searchValue, setLastSearch])

  // Memoize active words for the selected collection
  const localActiveWords = useMemo(() => {
    if (!selectedCollectionId) return new Set<string>()
    return localCollections[selectedCollectionId] || new Set<string>()
  }, [selectedCollectionId, localCollections])

  // Determine overall loading state
  const isLoading = searchLoading || projectLoading || collectionsLoading

  // Reset last attempted search when search value changes
  useEffect(() => {
    lastAttemptedSearch.current = null
    lastAttemptedSearchMode.current = null
    // Reset selected collection when starting a completely new search
    if (!searchValue) {
      setSelectedCollectionId(null)
      lastSuccessfullyCreatedCollection.current = null
    }
  }, [searchValue])

  // Start streaming search when parameters change
  useEffect(() => {
    if (projectId && searchValue &&
      (searchValue !== lastAttemptedSearch.current || searchMode !== lastAttemptedSearchMode.current)) {
      lastAttemptedSearch.current = searchValue
      lastAttemptedSearchMode.current = searchMode
      startSearch(projectId, searchValue, searchMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, searchValue, searchMode])

  // Create or select a collection when search is performed
  useEffect(() => {
    const handleSearchCollection = async () => {
      if (!searchValue || !projectId || !project || !collections) return



      // If we have a collection parameter, select that collection directly
      if (collectionParam) {
        const targetCollection = collections.find(c => c.id === collectionParam)
        if (targetCollection) {
          setLocalCollections(prev => {
            if (!prev[targetCollection.id]) {
              return {
                ...prev,
                [targetCollection.id]: new Set(targetCollection.savedWords?.map(sw => sw.word) || [])
              }
            }
            return prev
          })

          setSelectedCollectionId(targetCollection.id)

          // Remove the collection parameter from URL to clean it up
          const newParams = new URLSearchParams(searchParams)
          newParams.delete('collection')
          navigate(`/projects/${projectId}/search?${newParams.toString()}`, { replace: true })
          return
        }
      }

      // First try to find an existing collection with this name
      const existingCollection = collections.find(
        c => c?.name?.toLowerCase() === searchValue.toLowerCase()
      )

      if (existingCollection) {
        // If collection exists, just select it
        setLocalCollections(prev => {
          if (!prev[existingCollection.id]) {
            return {
              ...prev,
              [existingCollection.id]: new Set(existingCollection.savedWords?.map(sw => sw.word) || [])
            }
          }
          return prev
        })

        setSelectedCollectionId(existingCollection.id)
        return
      }

      // Only create a new collection if one doesn't exist and we haven't already tried successfully
      // Always allow creation of new collections when searching with different terms
      if (isCreatingCollection) {
        return
      }

      // Don't create duplicate collections for the same search term
      if (lastSuccessfullyCreatedCollection.current === searchValue) {
        return
      }

      lastAttemptedSearch.current = searchValue
      setIsCreatingCollection(true)

      try {
        // Create a new collection
        const collection = await createCollection({
          name: searchValue,
          projectId
        })

        if (!collection?.id) {
          throw new Error('Failed to create collection - no ID returned')
        }

        // Initialize the new collection in localCollections
        setLocalCollections(prev => ({
          ...prev,
          [collection.id]: new Set()
        }))

        setSelectedCollectionId(collection.id)
        lastSuccessfullyCreatedCollection.current = searchValue

        // Cache the search query for the new collection
        setLastSearch(collection.id, searchValue)
      } catch (error: unknown) {
        console.error('Error creating collection:', error)
        const errorMessage = error instanceof Error
          ? error.message
          : 'Failed to create collection'
        toast.error(errorMessage)
        setSelectedCollectionId(null)
      } finally {
        setIsCreatingCollection(false)
      }
    }

    handleSearchCollection()
  }, [searchValue, projectId, project, collections, createCollection, setLastSearch, collectionParam, searchParams, navigate])

  const handleAddWord = async (word: string, collectionId: string) => {
    // Optimistically update local state
    setLocalCollections(prev => {
      const newCollections = { ...prev }
      const existingWords = newCollections[collectionId] || new Set()
      newCollections[collectionId] = new Set([...existingWords, word])
      return newCollections
    })

    try {
      await addWordToCollection(word, collectionId)
    } catch (error) {
      // Revert optimistic update on error
      setLocalCollections(prev => {
        const newCollections = { ...prev }
        const existingWords = newCollections[collectionId] || new Set()
        const revertedWords = new Set(existingWords)
        revertedWords.delete(word)
        newCollections[collectionId] = revertedWords
        return newCollections
      })

      console.error('Error adding word to collection:', error)
      toast.error('Failed to add word to collection')
    }
  }

  const handleRemoveWord = async (word: string, collectionId: string) => {
    // Optimistically update local state
    setLocalCollections(prev => {
      const newCollections = { ...prev }
      const existingWords = newCollections[collectionId] || new Set()
      const updatedWords = new Set(existingWords)
      updatedWords.delete(word)
      newCollections[collectionId] = updatedWords
      return newCollections
    })

    try {
      await removeWordFromCollection(word, collectionId)
    } catch (error) {
      // Revert optimistic update on error
      setLocalCollections(prev => {
        const newCollections = { ...prev }
        const existingWords = newCollections[collectionId] || new Set()
        newCollections[collectionId] = new Set([...existingWords, word])
        return newCollections
      })

      console.error('Error removing word from collection:', error)
      toast.error('Failed to remove word from collection')
    }
  }

  const setSearchMode = useCallback((mode: 'or' | 'and') => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('mode', mode)
    navigate(`/projects/${projectId}/search?${newParams.toString()}`)
  }, [navigate, projectId, searchParams])

  const onLoadMore = useCallback(async () => {
    if (projectId && searchValue) {
      await loadMore(projectId, searchValue, searchMode)
    }
  }, [projectId, searchValue, searchMode, loadMore])

  const onAddCollection = useCallback(() => {
    // Reset state to allow new collection creation
    setSelectedCollectionId(null)
    lastAttemptedSearch.current = null
    lastAttemptedSearchMode.current = null
    lastSuccessfullyCreatedCollection.current = null

    // Clear search bar and focus it for new collection creation
    clearAndFocusSearchBar()
  }, [clearAndFocusSearchBar])

  // Display information about match types - check for multiple phrases
  const hasMultiplePhrases = searchValue.includes('+')

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-row pt-[25px] gap-5 px-[30px]">
        <main className="flex-1 h-full space-y-6">
          {/* Search Mode Toggle - only show for multiple phrases and when we have search value */}
          {hasMultiplePhrases && searchValue && (
            <Toggle
              checked={searchMode === 'and'}
              onChange={(checked) => setSearchMode(checked ? 'and' : 'or')}
              leftLabel="OR"
              rightLabel="AND"
              variant="default"
              size="md"
            />
          )}

          {isLoading && <SearchContentLoading />}
          {!isLoading && !searchValue && <SearchContentEmpty />}
          {!isLoading && searchValue && (
            <SearchContent
              results={results}
              selectedCollectionId={selectedCollectionId}
              isCreatingCollection={isCreatingCollection}
              onAddWord={handleAddWord}
              onRemoveWord={handleRemoveWord}
              localActiveWords={localActiveWords}
              searchMode={searchMode}
              hasMultiplePhrases={hasMultiplePhrases}
              error={!!searchError}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
              canLoadMore={canLoadMore}
              isComplete={isComplete}
              wasStreaming={wasStreaming}
            />
          )}
        </main>
        <aside className="w-[300px] flex-shrink-0">
          <CollectionsSidebar
            project={project}
            collections={collections}
            onRemoveWord={handleRemoveWord}
            localCollections={localCollections}
            isLoading={collectionsLoading}
            onAddCollection={onAddCollection}
          />
        </aside>
      </div>
    </div>
  )
}
