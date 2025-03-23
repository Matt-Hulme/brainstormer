import { useSearchParams } from 'react-router-dom'
import { SearchResultsLoading } from './SearchResultsLoading'
import { SearchResultsTerm } from './SearchResultsTerm'

export const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('term') ?? ''
  const isLoading = true
  // const isLoading = false

  if (isLoading) return <SearchResultsLoading searchTerm={searchTerm} />

  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <SearchResultsTerm searchTerm={searchTerm} />
    </main>
  )
}
