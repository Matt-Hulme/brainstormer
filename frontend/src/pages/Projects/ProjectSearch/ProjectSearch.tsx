// import { useParams } from 'react-router-dom'
import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { SearchBar } from '@/components/SearchBar'
import { ProjectSearchContentLoading } from './ProjectSearchContentLoading'
import { ProjectSearchContent } from './ProjectSearchContent'
import { useSearchParams } from 'react-router-dom'
import { AlignLeft, Target } from 'lucide-react'
import { Button, VennDiagramIcon } from '@/components'

export const ProjectSearch = () => {
  // const { projectId } = useParams()
  // const isLoading = true
  const isLoading = false
  const [searchParams] = useSearchParams()
  const searchValue = searchParams.get('q') ?? ''
  const activeView = searchParams.get('view') ?? 'list'

  return (
    <div className="flex flex-row items-start gap-[10px]">
      <HamburgerSidebar>
        <div className="space-y-[10px]">
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${
              activeView === 'list' ? 'bg-secondary-0' : 'bg-transparent'
            } hover:bg-secondary-0/50`}
            onClick={() => {}}
          >
            <AlignLeft
              className={`${activeView === 'list' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${
              activeView === 'connections' ? 'bg-secondary-0' : 'bg-transparent'
            } hover:bg-secondary-0/50`}
            onClick={() => {}}
          >
            <VennDiagramIcon
              className={`${activeView === 'connections' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
          <Button
            variant="icon"
            className={`w-[35px] h-[35px] rounded-md ${
              activeView === 'focus' ? 'bg-secondary-0' : 'bg-transparent'
            } hover:bg-secondary-0/50`}
            onClick={() => {}}
          >
            <Target
              className={`${activeView === 'focus' ? 'color-secondary-2' : 'color-secondary-1'} transition-colors group-hover:color-secondary-2`}
            />
          </Button>
        </div>
      </HamburgerSidebar>
      <div className="flex flex-col w-full h-screen">
        <SearchBar searchValue={searchValue} className="text-h3 text-secondary-4" />
        <main className="flex-1 h-full">
          {isLoading && <ProjectSearchContentLoading />}
          {!isLoading && <ProjectSearchContent />}
        </main>
      </div>
    </div>
  )
}
