import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { SearchBar } from '@/components/SearchBar'
import { SearchContentLoading } from './SearchContentLoading'
import { SearchContent } from './SearchContent'
import { SearchContentEmpty } from './SearchContentEmpty'
import { CollectionsSidebar } from './CollectionsSidebar'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { AlignLeft, Target, GitBranch, Layers } from 'lucide-react'
import { Button, showUndevelopedFeatureToast, VennDiagramIcon } from '@/components'
import { useSearchQuery, useGetProjectQuery, useGetCollectionsQuery, useAddWordToCollectionMutation, useRemoveWordFromCollectionMutation, useCreateCollectionMutation, useCollectionSearchCache } from '@/hooks'
import { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { toast } from 'react-toastify'

export const Search = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchValue = searchParams.get('q') ?? ''
  const activeView = searchParams.get('view') ?? 'list'
  const searchMode = searchParams.get('mode') as 'or' | 'and' | 'both' ?? 'both'
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const lastAttemptedSearch = useRef<string | null>(null)

  const { data, isLoading: searchLoading, error: searchError } = useSearchQuery(projectId ?? '', searchValue, searchMode)
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

  // Create a collection when search is performed
  useEffect(() => {
    const createSearchCollection = async () => {
      if (!searchValue || !projectId || !project) return

      // Skip if we've already attempted to create a collection for this search value
      if (lastAttemptedSearch.current === searchValue) return

      lastAttemptedSearch.current = searchValue
      setIsCreatingCollection(true)

      try {
        // First try to find an existing collection with this name
        const existingCollection = collections?.find(
          c => c?.name?.toLowerCase() === searchValue.toLowerCase()
        )

        if (existingCollection) {
          // Ensure the existing collection is in localCollections
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
          setIsCreatingCollection(false)
          return
        }

        // If no existing collection found, create a new one
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
      } catch (error: any) {
        console.error('Error creating collection:', error)
        const errorMessage = error?.response?.data?.detail ?? error?.message ?? 'Failed to create collection'
        toast.error(errorMessage)
        setSelectedCollectionId(null)
      } finally {
        setIsCreatingCollection(false)
      }
    }

    createSearchCollection()
  }, [searchValue, projectId, project, collections, createCollection, setLastSearch])

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

  const setSearchMode = useCallback((mode: 'or' | 'and' | 'both') => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('mode', mode)
    navigate(`/projects/${projectId}/search?${newParams.toString()}`)
  }, [navigate, projectId, searchParams])

  // Display information about match types
  const hasAndMatches = data?.suggestions?.some(s => s?.matchType === 'and') ?? false
  const hasOrMatches = data?.suggestions?.some(s => s?.matchType === 'or') ?? false
  const hasMultiplePhrases = searchValue.includes('||')

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar>
        <div className="space-y-[10px]">
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${activeView === 'list' ? 'bg-secondary-0' : 'bg-transparent'
              } hover:bg-secondary-0/50`}
            onClick={showUndevelopedFeatureToast}
          >
            <AlignLeft
              className={`${activeView === 'list' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${activeView === 'connections' ? 'bg-secondary-0' : 'bg-transparent'
              } hover:bg-secondary-0/50`}
            onClick={showUndevelopedFeatureToast}
          >
            <VennDiagramIcon
              className={`${activeView === 'connections' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${activeView === 'mindmap' ? 'bg-secondary-0' : 'bg-transparent'
              } hover:bg-secondary-0/50`}
            onClick={showUndevelopedFeatureToast}
          >
            <GitBranch
              className={`${activeView === 'mindmap' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${activeView === 'layers' ? 'bg-secondary-0' : 'bg-transparent'
              } hover:bg-secondary-0/50`}
            onClick={showUndevelopedFeatureToast}
          >
            <Layers
              className={`${activeView === 'layers' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
        </div>
        {hasMultiplePhrases && (
          <div className="mt-[20px] space-y-[10px]">
            <div className="text-xs color-secondary-3 mb-2">Search Mode:</div>
            <div className="space-y-[5px]">
              <Button
                variant="icon"
                title="OR mode - Include results matching any phrase"
                className={`w-[35px] h-[35px] rounded-md ${searchMode === 'or' ? 'bg-secondary-0' : 'bg-transparent'
                  } hover:bg-secondary-0/50`}
                onClick={() => setSearchMode('or')}
              >
                <Target
                  className={`${searchMode === 'or' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
                />
              </Button>
              <Button
                variant="icon"
                title="AND mode - Include only results matching all phrases"
                className={`w-[35px] h-[35px] rounded-md ${searchMode === 'and' ? 'bg-secondary-0' : 'bg-transparent'
                  } hover:bg-secondary-0/50`}
                onClick={() => setSearchMode('and')}
              >
                <GitBranch
                  className={`${searchMode === 'and' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
                />
              </Button>
              <Button
                variant="icon"
                title="BOTH mode - Include results from both OR and AND modes"
                className={`w-[35px] h-[35px] rounded-md ${searchMode === 'both' ? 'bg-secondary-0' : 'bg-transparent'
                  } hover:bg-secondary-0/50`}
                onClick={() => setSearchMode('both')}
              >
                <VennDiagramIcon
                  className={`${searchMode === 'both' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
                />
              </Button>
            </div>
          </div>
        )}
      </HamburgerSidebar>
      <div className="flex flex-col w-full h-screen">
        <SearchBar searchValue={searchValue} className="text-h3 text-secondary-4" />

        {hasMultiplePhrases && !isLoading && (data?.suggestions?.length ?? 0) > 0 && (
          <div className="px-4 py-2 bg-secondary-0/50 text-xs text-secondary-3">
            {searchMode === 'both' && hasAndMatches && hasOrMatches && (
              <p>Showing results matching any phrase (OR) and all phrases (AND)</p>
            )}
            {searchMode === 'or' && (
              <p>Showing results matching any phrase (OR)</p>
            )}
            {searchMode === 'and' && (
              <p>Showing results matching all phrases (AND)</p>
            )}
          </div>
        )}

        <div className="flex flex-row pt-[25px]">
          <main className="flex-1 h-full">
            {isLoading && <SearchContentLoading />}
            {searchError && <SearchContentEmpty />}
            {!isLoading && !searchError && (
              <SearchContent
                projectId={projectId ?? ''}
                results={data?.suggestions ?? []}
                project={project}
                collections={collections}
                selectedCollectionId={selectedCollectionId}
                isCreatingCollection={isCreatingCollection}
                onAddWord={handleAddWord}
                onRemoveWord={handleRemoveWord}
                localActiveWords={localActiveWords}
              />
            )}
          </main>
          <aside className="ml-5">
            <CollectionsSidebar
              projectId={projectId ?? ''}
              project={project}
              collections={collections}
              selectedCollectionId={selectedCollectionId}
              onCollectionSelect={setSelectedCollectionId}
              onAddWord={handleAddWord}
              onRemoveWord={handleRemoveWord}
              localCollections={localCollections}
              isLoading={collectionsLoading}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
