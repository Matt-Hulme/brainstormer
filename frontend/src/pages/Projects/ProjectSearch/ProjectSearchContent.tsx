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
  }, [handleRemoveWord])

  // Group results by match type for efficient rendering
  const groupedResults = results.reduce((acc, result) => {
    const matchType = result.matchType ?? 'or'
    if (!acc[matchType]) {
      acc[matchType] = []
    }
    acc[matchType].push(result)
    return acc
  }, {} as Record<string, KeywordSuggestion[]>)

  // Check if we have multiple match types
  const hasMultipleMatchTypes = Object.keys(groupedResults).length > 1

  return (
    <div className="flex flex-row pt-[25px]">
      <main className="flex-1 pb-[35px]">
        {/* Show AND matches first if they exist */}
        {groupedResults['and'] && (
          <div className="mb-8">
            {hasMultipleMatchTypes && (
              <div className="ml-[20px] mb-3">
                <h3 className="text-primary-1 font-semibold mb-1">Strong Matches (ALL Phrases)</h3>
                <p className="text-xs text-secondary-3 mb-2">
                  These words connect to <strong>all</strong> of your search phrases
                </p>
              </div>
            )}
            <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
              {groupedResults['and'].map((result, index) => {
                const termId = `${result.word}-and-${index}`
                return (
                  <SearchTerm
                    key={termId}
                    isActive={activeTermIds.has(termId)}
                    onClick={() =>
                      activeTermIds.has(termId) ? handleUnselectWord(termId) : handleSelectWord(termId)
                    }
                    matchType="and"
                  >
                    {result.word}
                  </SearchTerm>
                )
              })}
            </div>
          </div>
        )}

        {/* Then show OR matches */}
        {groupedResults['or'] && (
          <div>
            {hasMultipleMatchTypes && (
              <div className="ml-[20px] mb-3">
                <h3 className="text-secondary-4 font-semibold mb-1">General Matches (ANY Phrase)</h3>
                <p className="text-xs text-secondary-3 mb-2">
                  These words connect to <strong>at least one</strong> of your search phrases
                </p>
              </div>
            )}
            <div className="flex flex-row flex-wrap gap-x-[20px] gap-y-[10px]">
              {groupedResults['or'].map((result, index) => {
                const termId = `${result.word}-or-${index}`
                return (
                  <SearchTerm
                    key={termId}
                    isActive={activeTermIds.has(termId)}
                    onClick={() =>
                      activeTermIds.has(termId) ? handleUnselectWord(termId) : handleSelectWord(termId)
                    }
                    matchType="or"
                  >
                    {result.word}
                  </SearchTerm>
                )
              })}
            </div>
          </div>
        )}
      </main>
      <aside className="ml-5">
        <ProjectSearchCollectionsSidebar
          projectName={projectName}
          activeWords={activeWords}
          onRemoveWord={handleRemoveWord}
          onWordAdded={handleWordAdded}
          project={project}
        />
      </aside>
    </div>
  )
}
