interface SearchResultProps {
  text: string
  isActive?: boolean
}

export const SearchResult = ({ text, isActive = false }: SearchResultProps) => {
  return (
    <div
      className={`flex items-center justify-center bg-transparent rounded-full overflow-hidden border-2 ${
        isActive ? 'border-primary' : 'border-secondary-4'
      } px-5 py-4`}
    >
      <span className="text-sm font-medium text-white truncate">{text}</span>
    </div>
  )
}
