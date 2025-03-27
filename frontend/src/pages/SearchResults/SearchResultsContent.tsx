import { SearchResultsLoading } from './SearchResultsContentLoading'
import { SearchResult } from './SearchResult/SearchResult'
import { useState, useEffect } from 'react'

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

    const generateResults = async () => {
      if (!searchTerm) return

      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('http://127.0.0.1:8000/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: searchTerm,
            temperature: 0.7,
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.detail ||
              `Server error: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()
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

    generateResults()
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

