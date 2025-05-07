import { searchResultsMock } from './mocks/searchResultsMock'
import { ProjectSearchCollectionsSidebar } from './ProjectSearchCollectionsSidebar'
import { Button } from '@/components'
// import { useSearchParams } from 'react-router-dom'

export const ProjectSearchContent = () => {
  // const [searchParams] = useSearchParams()
  // const searchQuery = searchParams.get('q')
  const searchResults = Array.from({ length: 5 }, () => [...searchResultsMock]).flat()

  return (
    <div className="flex flex-row pt-[25px]">
      <div className="pb-[35px] flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
        {searchResults.map((result, index) => (
          <Button
            key={index}
            variant="text"
            className="py-[5px]"
            textClass="text-h4 text-secondary-2"
          >
            {result}
          </Button>
        ))}
      </div>
      <ProjectSearchCollectionsSidebar />
    </div>
  )
}
