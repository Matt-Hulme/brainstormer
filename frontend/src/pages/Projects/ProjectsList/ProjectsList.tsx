import { SearchBar } from '@/components/SearchBar'
import { HamburgerSidebar } from '../../../components/HamburgerSidebar'
import { ProjectsListContent } from './ProjectsListContent'
import { ProjectsListContentEmpty } from './ProjectsListContentEmpty'
import { useGetProjectsQuery } from './useGetProjectsQuery'
import { Spinner, Alert } from '@/components/design-system'

export const ProjectsList = () => {
  const { projects, loading, error } = useGetProjectsQuery()
  const hasProjects = projects.length > 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" title="Error" description={error.message} />
      </div>
    )
  }

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar />
      <div className="flex flex-col w-full">
        <SearchBar searchValue={''} />
        <main>
          {hasProjects && <ProjectsListContent projects={projects} />}
          {!hasProjects && <ProjectsListContentEmpty />}
        </main>
      </div>
    </div>
  )
}
