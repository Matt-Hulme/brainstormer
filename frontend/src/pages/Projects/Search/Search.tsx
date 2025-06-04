import { SearchContentLoading } from './SearchContentLoading'
import { SearchContent } from './SearchContent'
import { SearchContentEmpty } from './SearchContentEmpty'
import { CollectionsSidebar } from './CollectionsSidebar'
import { Toggle } from '@/components'
import { useSearchBarContext } from '@/components'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { useGetProjectQuery, useGetCollectionsQuery, useAddWordToCollectionMutation, useRemoveWordFromCollectionMutation, useCreateCollectionMutation, useCollectionSearchCache } from '@/hooks'
import { useSearchWithLoadMore } from '@/hooks/search/useSearchWithLoadMore'
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
  const focusParam = searchParams.get('focus')
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const lastAttemptedSearch = useRef<string | null>(null)
  const { results, isLoading: searchLoading, isLoadingMore, error: searchError, loadMore, canLoadMore } = useSearchWithLoadMore(projectId ?? '', searchValue, searchMode)
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
  }, [searchValue])

  // Handle focus parameter from ProjectDetails navigation
  useEffect(() => {
    if (focusParam === 'true') {
      // Clear and focus the search bar
      clearAndFocusSearchBar()
      navigate(`/projects/${projectId}/search`, { replace: true })
    }
  }, [focusParam, navigate, projectId, clearAndFocusSearchBar])

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

      // Only create a new collection if one doesn't exist and we haven't already tried
      if (lastAttemptedSearch.current === searchValue) return

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

  const onAddCollection = useCallback(() => {
    // Clear the search and navigate to a fresh search state to start new collection creation
    navigate(`/projects/${projectId}/search?focus=true`, { replace: true })
  }, [navigate, projectId])

  const onLoadMore = useCallback(async (excludeWords: string[]) => {
    if (!canLoadMore) return
    await loadMore(excludeWords)
  }, [loadMore, canLoadMore])

  // Display information about match types
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
