import { Fragment, } from 'react'
import { X, } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { AddCollectionChip } from '@/components'
import { Button } from '@/components'
import { useCollectionSearchCache, useDeleteCollectionMutation, useGetCollectionsQuery, useGetProjectQuery, useRemoveWordFromCollectionMutation } from '@/hooks'
import { ProjectDetailsHeader } from './ProjectDetailsHeader'

export const ProjectDetails = () => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const { error: projectError, isLoading: projectLoading, project } = useGetProjectQuery(projectId ?? '')
  const { collections, error: collectionsError, loading: collectionsLoading } = useGetCollectionsQuery(project?.id ?? '')
  const { getLastSearch } = useCollectionSearchCache()
  const deleteCollectionMutation = useDeleteCollectionMutation()
  const { removeWordFromCollection } = useRemoveWordFromCollectionMutation()

  const onCollectionClick = (collection: { id: string; name: string }) => {
    if (!projectId) return

    // Get the last search query from cache, fallback to collection name
    const lastSearch = getLastSearch(collection.id)
    const searchQuery = lastSearch || collection.name
    navigate(`/projects/${projectId}/search?q=${encodeURIComponent(searchQuery)}&collection=${collection.id}`)
  }

  const onDeleteCollection = (e: React.MouseEvent, collectionId: string, collectionName: string) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete the collection "${collectionName}"?`)) {
      deleteCollectionMutation.mutate(collectionId)
    }
  }

  const onDeleteWord = (e: React.MouseEvent, word: string, collectionId: string) => {
    e.stopPropagation()
    removeWordFromCollection(word, collectionId)
  }

  const onAddCollection = () => {
    // Navigate to a blank search page within this project with focus parameter
    navigate(`/projects/${projectId}/search?focus=true`)
  }

  if (projectLoading || collectionsLoading) {
    return (
      <div className="flex items-center justify-center h-full text-secondary-2">Loading...</div>
    )
  }

  if (projectError || collectionsError) {
    return (
      <div className="flex items-center justify-center h-full color-red">
        Failed to load project details
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-[30px]">
      <ProjectDetailsHeader project={project ?? null} />
      <main className="grid [grid-template-columns:minmax(220px,auto)_1fr] gap-x-[120px] gap-y-[30px]">
        <div className="text-p3 color-secondary-4">COLLECTIONS</div>
        <div className="text-p3 color-secondary-4">SAVED WORDS</div>
        {collections?.map((collection, idx) => (
          <Fragment key={collection.id}>
            {idx !== 0 && <div className="col-span-2 w-full h-[1px] bg-secondary-2/20" />}
            <div className="pt-[30px]">
              <div className="flex flex-row items-center gap-[4px] group">
                <button
                  className="flex flex-row items-center gap-[4px] hover:opacity-80 transition-opacity"
                  onClick={() => onCollectionClick(collection)}
                >
                  <h3 className="text-h3 color-secondary-4">{collection.name}</h3>
                </button>
                <Button
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-h-6 max-w-6"
                  onClick={(e) => onDeleteCollection(e, collection.id, collection.name)}
                  variant="icon"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
            <div className="pt-[33px] pb-[30px]">
              {collection.savedWords?.length > 0 ? (
                <ul className="space-y-[10px]">
                  {collection.savedWords.map(word => (
                    <li className="text-p1 color-secondary-4 flex items-center gap-2 group" key={word.id}>
                      <span>{word.word}</span>
                      <Button
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-4 w-4 max-h-[18px] max-w-[18px] flex-shrink-0"
                        onClick={(e) => onDeleteWord(e, word.word, collection.id)}
                        variant="icon"
                      >
                        <X size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="color-secondary-1">No words (yet)</span>
              )}
            </div>
          </Fragment>
        ))}
        <div>
          <AddCollectionChip onClick={onAddCollection} />
        </div>
      </main>
    </div>
  )
}
