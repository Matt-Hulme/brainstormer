import { ProjectSearchCollectionsSidebar } from './ProjectSearchCollectionsSidebar'
import { useState, useCallback } from 'react'
import { SearchTerm } from './SearchTerm'
import { KeywordSuggestion } from '@/config/api/types'
import { Project } from '@/types'

interface ProjectSearchContentProps {
  projectName: string
  results: KeywordSuggestion[]
  project: Project | undefined
}

export const ProjectSearchContent = ({ projectName, results, project }: ProjectSearchContentProps) => {
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

  const handleWordAdded = useCallback((word: string) => {
    // If a word is successfully added to a collection, we can optionally remove it from active words
    // Uncomment this if you want to clear words after they're added to a collection automatically
    // handleRemoveWord(word)
  }, [])

  return (
    <div className="flex flex-row pt-[25px]">
      <div className="flex-1 pb-[35px]">
        <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
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
      </div>
      <div className="ml-5">
        <ProjectSearchCollectionsSidebar
          projectName={projectName}
          activeWords={activeWords}
          onRemoveWord={handleRemoveWord}
          onWordAdded={handleWordAdded}
          project={project}
        />
      </div>
    </div>
  )
}
