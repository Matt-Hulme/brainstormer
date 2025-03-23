import { SearchResultsLoading } from './SearchResultsContentLoading'

interface SearchResultsContentProps {
  isLoading: boolean
  searchTerm: string
}

export const SearchResultsContent = ({
  isLoading,
  searchTerm,
}: SearchResultsContentProps) => {
  if (isLoading) {
    return <SearchResultsLoading />
  }

  return (
    <div className="w-full">
      <div className="flex-1">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <p className="text-white col-span-full">Results for "{searchTerm}"</p>
        </div>
      </div>
    </div>
  )
}
