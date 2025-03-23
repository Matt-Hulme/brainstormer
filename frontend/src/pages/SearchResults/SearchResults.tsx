import { useSearchParams, useNavigate } from 'react-router-dom'
import { SearchResultsTerm } from './SearchResultsTerm'
import { Button } from '@radix-ui/themes'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { SearchResultsContent } from './SearchResultsContent'

export const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('term') ?? ''
  // const isLoading = false
  const isLoading = true
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <main className="flex flex-col gap-8 items-center h-screen bg-dark-1 pt-10 pb-6 px-4">
      <div className="w-full flex flex-col gap-8">
        <div className="self-start">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="flex items-center gap-2 text-secondary-7 hover:text-primary-1"
          >
            <ArrowLeftIcon width={20} height={20} />
            <span>New Search</span>
          </Button>
        </div>
        <SearchResultsTerm searchTerm={searchTerm} />
        <SearchResultsContent isLoading={isLoading} searchTerm={searchTerm} />
      </div>
    </main>
  )
}
