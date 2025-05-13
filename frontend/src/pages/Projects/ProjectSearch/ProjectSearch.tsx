import { HamburgerSidebar } from '@/components/HamburgerSidebar'
import { SearchBar } from '@/components/SearchBar'
import { ProjectSearchContentLoading } from './ProjectSearchContentLoading'
import { ProjectSearchContent } from './ProjectSearchContent'
import { useSearchParams, useParams } from 'react-router-dom'
import { AlignLeft, Target } from 'lucide-react'
import { Button, VennDiagramIcon } from '@/components'
import { useSearchQuery } from './useSearchQuery'

export const ProjectSearch = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()
  const searchValue = searchParams.get('q') ?? ''
  const activeView = searchParams.get('view') ?? 'list'

  const { results, loading, error } = useSearchQuery(projectId!, searchValue)

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
          {loading && <ProjectSearchContentLoading />}
          {!loading && !error && <ProjectSearchContent projectId={projectId!} results={results} />}
          {error && (
            <div className="flex items-center justify-center h-full text-red-500">
              Failed to load search results
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
