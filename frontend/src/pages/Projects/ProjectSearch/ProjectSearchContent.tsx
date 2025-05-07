import { searchResultsMock } from './mocks/searchResultsMock'
import { ProjectSearchCollectionsSidebar } from './ProjectSearchCollectionsSidebar'
import { useState, useCallback } from 'react'
import { SearchTerm } from './SearchTerm'
// import { useSearchParams } from 'react-router-dom'

export const ProjectSearchContent = () => {
  // const [searchParams] = useSearchParams()
  // const searchQuery = searchParams.get('q')
  const searchResults = Array.from({ length: 5 }, () => [...searchResultsMock]).flat()
  const [activeTermIds, setActiveTermIds] = useState<Set<string>>(new Set())

  const handleTermClick = useCallback((termId: string) => {
    setActiveTermIds(prevActiveTermIds => {
      const newActiveTermIds = new Set(prevActiveTermIds)
      if (newActiveTermIds.has(termId)) {
        newActiveTermIds.delete(termId)
      } else {
        newActiveTermIds.add(termId)
      }
      return newActiveTermIds
    })
  }, [])

  return (
    <div className="flex flex-row pt-[25px]">
      <div className="pb-[35px] flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
        {searchResults.map((term, index) => {
          const termId = `${term}-${index}`
          return (
            <SearchTerm
              key={termId}
              isActive={activeTermIds.has(termId)}
              onClick={() => handleTermClick(termId)}
            >
              {term}
            </SearchTerm>
          )
        })}
      </div>
      <ProjectSearchCollectionsSidebar />
    </div>
  )
}
