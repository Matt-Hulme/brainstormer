// import { useParams } from 'react-router-dom'
import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { SearchBar } from '@/components/SearchBar'
import { ProjectSearchContentLoading } from './ProjectSearchContentLoading'
import { ProjectSearchContent } from './ProjectSearchContent'

export const ProjectSearch = () => {
  // const { projectId } = useParams()
  const isLoading = true

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar />
      <div className="flex flex-col w-full h-screen">
        <SearchBar />
        <main className="flex flex-1 justify-center items-center">
          {isLoading && <ProjectSearchContentLoading />}
          {!isLoading && <ProjectSearchContent />}
        </main>
      </div>
    </div>
  )
}
