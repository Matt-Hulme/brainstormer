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

  const handleSelectWord = useCallback((termId: string) => {
    setActiveTermIds(prevActiveTermIds => {
      const newActiveTermIds = new Set(prevActiveTermIds)
      newActiveTermIds.add(termId)
      return newActiveTermIds
    })
  }, [])

  const handleUnselectWord = useCallback((termId: string) => {
    setActiveTermIds(prevActiveTermIds => {
      const newActiveTermIds = new Set(prevActiveTermIds)
      newActiveTermIds.delete(termId)
      return newActiveTermIds
    })
  }, [])

  const activeWords = Array.from(activeTermIds).map(id => id.split('-')[0])

  const handleRemoveWord = useCallback((word: string) => {
    setActiveTermIds(prevActiveTermIds => {
      const newActiveTermIds = new Set(
        Array.from(prevActiveTermIds).filter(id => id.split('-')[0] !== word)
      )
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
              onClick={() =>
                activeTermIds.has(termId) ? handleUnselectWord(termId) : handleSelectWord(termId)
              }
            >
              {term}
            </SearchTerm>
          )
        })}
      </div>
      <ProjectSearchCollectionsSidebar activeWords={activeWords} onRemoveWord={handleRemoveWord} />
    </div>
  )
}
