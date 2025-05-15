import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { ProjectDetailsHeader } from './ProjectDetailsHeader'
// import { Fragment } from 'react'
// import { Button } from '@/components/design-system/Button'
// import { ArrowRight } from 'lucide-react'
// import { useParams } from 'react-router-dom'
// import { useGetCollectionsQuery } from '../ProjectsList/hooks/useGetCollectionsQuery'
// import { useGetProjectQuery } from '../ProjectsList/hooks/useGetProjectQuery'

export const ProjectDetails = () => {
  // const { projectId } = useParams<{ projectId: string }>()
  // const { project, loading: projectLoading, error: projectError } = useGetProjectQuery(projectId!)
  // const {
  //   collections,
  //   loading: collectionsLoading,
  //   error: collectionsError,
  // } = useGetCollectionsQuery(projectId!)

  // if (projectLoading || collectionsLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-full text-secondary-2">Loading...</div>
  //   )
  // }

  // if (projectError || collectionsError) {
  //   return (
  //     <div className="flex items-center justify-center h-full text-red-500">
  //       Failed to load project details
  //     </div>
  //   )
  // }

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar />
      <div className="flex flex-col w-full gap-[30px]">
        {/* <ProjectDetailsHeader project={project} /> */}
        <main className="grid [grid-template-columns:minmax(220px,auto)_1fr] gap-x-[120px]">
          <div className="text-p3 text-secondary-4">COLLECTIONS</div>
          <div className="text-p3 text-secondary-4">SAVED WORDS</div>
          {/* {collections?.map((collection, idx) => (
            <Fragment key={collection.id}>
              {idx !== 0 && <div className="col-span-2 w-full h-[1px] bg-secondary-2/20" />}
              <div className="pt-[30px]">
                <div className="flex flex-row items-center gap-[4px]">
                  <h3 className="text-h3 text-secondary-4">{collection.name}</h3>
                  <Button variant="icon" className="color-secondary-3">
                    <ArrowRight size={24} className="" />
                  </Button>
                </div>
              </div>
              <div className="pt-[33px] pb-[30px]">
                {collection.savedWords && collection.savedWords.length > 0 && (
                  <ul className="space-y-[10px]">
                    {collection.savedWords.map(word => (
                      <li className="text-p1 text-secondary-4" key={word.id}>
                        {word.word}
                      </li>
                    ))}
                  </ul>
                )}
                {(!collection.savedWords || collection.savedWords.length === 0) && (
                  <span className="text-secondary-1">No words (yet)</span>
                )}
              </div>
            </Fragment>
          ))} */}
        </main>
      </div>
    </div>
  )
}
