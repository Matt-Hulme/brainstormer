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

  useEffect(() => {
    const generateResults = async () => {
      if (!searchTerm) return

      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:8000/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ word: searchTerm }),
        })

        const data = await response.json()
        const formattedResults = data.map((text: string, index: number) => ({
          id: index,
          text,
          isActive: false,
        }))

        setResults(formattedResults)
      } catch (error) {
        console.error('Error generating results:', error)
        // You might want to show an error message to the user
      } finally {
        setIsLoading(false)
      }
    }

    generateResults()
  }, [searchTerm]) // Re-run when searchTerm changes

  const handleResultClick = async (id: number) => {
    try {
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: 'test' }),
      })
      const data = await response.json()
      console.log('Response from backend:', data)
    } catch (error) {
      console.error('Error calling backend:', error)
    }

    setResults((prevResults) =>
      prevResults.map((result) => ({
        ...result,
        isActive: result.id === id ? !result.isActive : result.isActive,
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

