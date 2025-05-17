import { SearchBar } from '@/components/SearchBar'
import { HamburgerSidebar } from '../../../components/HamburgerSidebar'
import { ProjectsListContent } from './ProjectsListContent'
import { ProjectsListContentEmpty } from './ProjectsListContentEmpty'
import { useGetProjectsQuery } from '@/hooks'

export const ProjectsList = () => {
  const { projects, isLoading, hasError } = useGetProjectsQuery()
  const hasProjects = projects?.length > 0

  if (isLoading) {
    return (
      <div className="flex flex-row items-start gap-[10px]">
        <HamburgerSidebar />
        <div className="flex flex-col w-full">
          <SearchBar searchValue={''} />
          <div className="flex items-center justify-center h-full text-secondary-2">Loading...</div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-row items-start gap-[10px]">
        <HamburgerSidebar />
        <div className="flex flex-col w-full">
          <SearchBar searchValue={''} />
          <div className="flex items-center justify-center h-full text-red-500">
            Failed to load projects
          </div>
        </div>
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
