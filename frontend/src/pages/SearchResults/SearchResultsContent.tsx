import { SearchResultsLoading } from './SearchResultsContentLoading'
import { SearchResult } from './SearchResult/SearchResult'
import { useState } from 'react'
import { searchResultsMock } from './consts'

interface SearchResultsContentProps {
  isLoading: boolean
}

export const SearchResultsContent = ({
  isLoading,
}: SearchResultsContentProps) => {
  const [results, setResults] = useState(() =>
    // Take first 100 items from mock data and format them
    searchResultsMock.slice(0, 100).map((text, index) => ({
      id: index,
      text,
      isActive: false,
    }))
  )

  const handleResultClick = (id: number) => {
    setResults((prevResults) =>
      prevResults.map((result) => ({
        ...result,
        isActive: result.id === id ? !result.isActive : result.isActive, // Toggle only the clicked item
      }))
    )
  }

  if (isLoading) {
    return <SearchResultsLoading />
  }

  return (
    <main className="flex flex-col items-center pb-6 px-4">
      <div className="w-full flex-1">
        <div className="flex flex-wrap gap-5 justify-center">
          {results.map((result) => (
            <div
              key={`result-${result.id}`}
              className="h-[40px] cursor-pointer"
              onClick={() => handleResultClick(result.id)}
            >
              <SearchResult text={result.text} isActive={result.isActive} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

