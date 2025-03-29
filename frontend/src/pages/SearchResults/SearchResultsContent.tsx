import { SearchResultsLoading } from './SearchResultsContentLoading'
import { SearchResult } from './SearchResult/SearchResult'
import { useState, useEffect } from 'react'
import { generateIdeas } from '../../utils/api'

interface SearchResultsContentProps {
  searchTerm: string
}

export const SearchResultsContent = ({
  searchTerm,
}: SearchResultsContentProps) => {
  const [results, setResults] = useState<
    Array<{ id: number; text: string; isActive: boolean }>
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchResults = async () => {
      if (!searchTerm) return

      setIsLoading(true)
      setError(null)
      try {
        const data = await generateIdeas(searchTerm, 0.7)

        // Expecting an array of generated texts from the backend
        const formattedResults = data.results.map(
          (text: string, index: number) => ({
            id: index,
            text,
            isActive: false,
          })
        )

        setResults(formattedResults)
      } catch (error) {
        console.error('Error generating results:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        )
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()

    return () => {
      abortController.abort()
    }
  }, [searchTerm])

  const handleResultClick = async (id: number) => {
    setResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, isActive: !result.isActive } : result
      )
    )
  }

  if (isLoading) {
    return <SearchResultsLoading />
  }

  return (
    <main className="flex flex-col items-center pb-6 px-4">
      {error && (
        <div className="w-full max-w-2xl mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
          error
        </div>
      )}
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
