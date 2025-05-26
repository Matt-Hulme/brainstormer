import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { SearchBar } from '@/components/SearchBar'
import { SearchContentLoading } from './SearchContentLoading'
import { SearchContent } from './SearchContent'
import { SearchContentEmpty } from './SearchContentEmpty'
import { CollectionsSidebar } from './CollectionsSidebar'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { AlignLeft, Target, GitBranch, Layers } from 'lucide-react'
import { Button, showUndevelopedFeatureToast, VennDiagramIcon } from '@/components'
import { useSearchQuery, useGetProjectQuery, useAddWordToCollectionMutation, useRemoveWordFromCollectionMutation, useCreateCollectionMutation } from '@/hooks'
import { useCallback, useState, useEffect, useRef } from 'react'
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
  const { addWordToCollection } = useAddWordToCollectionMutation()
  const { removeWordFromCollection } = useRemoveWordFromCollectionMutation()
  const { createCollection } = useCreateCollectionMutation()

  // Determine overall loading state
  const isLoading = searchLoading || projectLoading

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
        const existingCollection = project?.collections?.find(
          c => c?.name?.toLowerCase() === searchValue.toLowerCase()
        )

        if (existingCollection) {
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

        setSelectedCollectionId(collection.id)
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
  }, [searchValue, projectId, project, createCollection])

  const handleAddWord = async (word: string, collectionId: string) => {
    try {
      await addWordToCollection(word, collectionId)
    } catch (error) {
      console.error('Error adding word to collection:', error)
      toast.error('Failed to add word to collection')
    }
  }

  const handleRemoveWord = async (word: string, collectionId: string) => {
    try {
      await removeWordFromCollection(word, collectionId)
    } catch (error) {
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
            className={`w-[35px] h-[35px] rounded-md ${activeView === 'focus' ? 'bg-secondary-0' : 'bg-transparent'
              } hover:bg-secondary-0/50`}
            onClick={showUndevelopedFeatureToast}
          >
            <Target
              className={`${activeView === 'focus' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
        </div>

        {hasMultiplePhrases && (
          <div className="mt-5 pt-5 border-t border-secondary-1/20">
            <p className="text-xs text-secondary-2 mb-2">Search Mode</p>
            <div className="space-y-[10px]">
              <Button
                variant="icon"
                title="OR mode - Include results matching any phrase"
                className={`w-[35px] h-[35px] rounded-md ${searchMode === 'or' ? 'bg-secondary-0' : 'bg-transparent'
                  } hover:bg-secondary-0/50`}
                onClick={() => setSearchMode('or')}
              >
                <GitBranch
                  className={`${searchMode === 'or' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
                />
              </Button>
              <Button
                variant="icon"
                title="AND mode - Only include results matching all phrases"
                className={`w-[35px] h-[35px] rounded-md ${searchMode === 'and' ? 'bg-secondary-0' : 'bg-transparent'
                  } hover:bg-secondary-0/50`}
                onClick={() => setSearchMode('and')}
              >
                <Layers
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
                selectedCollectionId={selectedCollectionId}
                isCreatingCollection={isCreatingCollection}
                onAddWord={handleAddWord}
                onRemoveWord={handleRemoveWord}
              />
            )}
          </main>
          <aside className="ml-5">
            <CollectionsSidebar
              projectId={projectId ?? ''}
              project={project}
              selectedCollectionId={selectedCollectionId}
              onCollectionSelect={setSelectedCollectionId}
              onAddWord={handleAddWord}
              onRemoveWord={handleRemoveWord}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
