import { SearchBar } from '@/components/SearchBar'
import { HamburgerSidebar } from '../../../components/HamburgerSidebar'
import { ProjectsListContent } from './ProjectsListContent'
import { ProjectsListContentEmpty } from './ProjectsListContentEmpty'

export const ProjectsList = () => {
  const projectsMock = [1, 2]
  const hasProjects = projectsMock.length > 0

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar />
      <div className="flex flex-col w-full">
        <SearchBar searchValue={''} />
        <main>
          {hasProjects && <ProjectsListContent />}
          {!hasProjects && <ProjectsListContentEmpty />}
        </main>
      </div>
    </div>
  )
}
