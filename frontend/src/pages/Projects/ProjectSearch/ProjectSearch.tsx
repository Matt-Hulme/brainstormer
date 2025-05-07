// import { useParams } from 'react-router-dom'
import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { SearchBar } from '@/components/SearchBar'
import { ProjectSearchContentLoading } from './ProjectSearchContentLoading'
import { ProjectSearchContent } from './ProjectSearchContent'
import { useSearchParams } from 'react-router-dom'

export const ProjectSearch = () => {
  // const { projectId } = useParams()
  const isLoading = false
  const [searchParams] = useSearchParams()
  const searchValue = searchParams.get('q') ?? ''

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar />
      <div className="flex flex-col w-full h-screen">
        <SearchBar searchValue={searchValue} className="text-h3 text-secondary-4" />
        <main>
          {isLoading && <ProjectSearchContentLoading />}
          {!isLoading && <ProjectSearchContent />}
        </main>
      </div>
    </div>
  )
}
