import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/design-system/Button'
import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { useCollectionSearchCache, useGetCollectionsQuery, useGetProjectQuery } from '@/hooks'
import { ProjectDetailsHeader } from './ProjectDetailsHeader'

export const ProjectDetails = () => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const { error: projectError, isLoading: projectLoading, project } = useGetProjectQuery(projectId ?? '')
  const { collections, error: collectionsError, loading: collectionsLoading } = useGetCollectionsQuery(project?.id ?? '')
  const { getLastSearch } = useCollectionSearchCache()

  const onCollectionClick = (collection: any) => {
    if (!projectId) return

    // Get the last search query from cache, fallback to collection name
    const lastSearch = getLastSearch(collection.id)
    const searchQuery = lastSearch || collection.name
    navigate(`/projects/${projectId}/search?q=${encodeURIComponent(searchQuery)}`)
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
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar />
      <div className="flex flex-col w-full gap-[30px]">
        <ProjectDetailsHeader project={project ?? null} />
        <main className="grid [grid-template-columns:minmax(220px,auto)_1fr] gap-x-[120px]">
          <div className="text-p3 color-secondary-4">COLLECTIONS</div>
          <div className="text-p3 color-secondary-4">SAVED WORDS</div>
          {collections?.map((collection, idx) => (
            <Fragment key={collection.id}>
              {idx !== 0 && <div className="col-span-2 w-full h-[1px] bg-secondary-2/20" />}
              <div className="pt-[30px]">
                <div className="flex flex-row items-center gap-[4px]">
                  <button
                    className="flex flex-row items-center gap-[4px] hover:opacity-80 transition-opacity"
                    onClick={() => onCollectionClick(collection)}
                  >
                    <h3 className="text-h3 color-secondary-4">{collection.name}</h3>
                    <Button className="color-secondary-3" variant="icon">
                      <ArrowRight className="" size={24} />
                    </Button>
                  </button>
                </div>
              </div>
              <div className="pt-[33px] pb-[30px]">
                {collection.savedWords?.length > 0 ? (
                  <ul className="space-y-[10px]">
                    {collection.savedWords.map(word => (
                      <li className="text-p1 color-secondary-4" key={word.id}>
                        {word.word}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="color-secondary-1">No words (yet)</span>
                )}
              </div>
            </Fragment>
          ))}
        </main>
      </div>
    </div>
  )
}
