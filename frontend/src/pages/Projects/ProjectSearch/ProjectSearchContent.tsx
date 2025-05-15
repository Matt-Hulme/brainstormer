import { ProjectSearchCollectionsSidebar } from './ProjectSearchCollectionsSidebar'
import { useState, useCallback } from 'react'
import { SearchTerm } from './SearchTerm'
import { KeywordSuggestion } from '@/config/api/types'

interface ProjectSearchContentProps {
  projectName: string
  results: KeywordSuggestion[]
}

export const ProjectSearchContent = ({ projectName, results }: ProjectSearchContentProps) => {
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
        {results.map((result, index) => {
          const termId = `${result.word}-${index}`
          return (
            <SearchTerm
              key={termId}
              isActive={activeTermIds.has(termId)}
              onClick={() =>
                activeTermIds.has(termId) ? handleUnselectWord(termId) : handleSelectWord(termId)
              }
            >
              {result.word}
            </SearchTerm>
          )
        })}
      </div>
      <ProjectSearchCollectionsSidebar
        projectName={projectName}
        activeWords={activeWords}
        onRemoveWord={handleRemoveWord}
      />
    </div>
  )
}
