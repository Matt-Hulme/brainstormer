interface SearchResultsTermProps {
  searchTerm: string
}

export const SearchResultsTerm = ({ searchTerm }: SearchResultsTermProps) => {
  return (
    <div className="bg-primary-1 rounded-full py-2.5 px-7.5">
      <h1 className="text-header-1 text-secondary-4">{searchTerm}</h1>
    </div>
  )
}
