import { SearchBar } from '@/components/SearchBar'
import { HamburgerSidebar } from '../../../components/HamburgerSidebar'
import { ProjectsListContent } from './ProjectsListContent'
import { ProjectsListEmpty } from './ProjectsListEmpty'

export const ProjectsListLayout = () => {
  const projectsMock = [1, 2]
  const hasProjects = projectsMock.length > 0

  return (
    <div className="flex flex-row items-start min-h-screen gap-[10px]">
      <HamburgerSidebar />
      <div className="flex-1">
        <SearchBar />
        <main>
          {hasProjects && <ProjectsListContent />}
          {!hasProjects && <ProjectsListEmpty />}
        </main>
      </div>
    </div>
  )
}
