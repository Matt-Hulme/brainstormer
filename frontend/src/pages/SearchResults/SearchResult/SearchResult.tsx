interface SearchResultProps {
  text: string
  isActive?: boolean
}

export const SearchResult = ({ text, isActive = false }: SearchResultProps) => {
  return (
    <div
      className={`flex items-center justify-center bg-transparent rounded-full overflow-hidden border ${
        isActive ? 'border-primary-1 border-2' : 'border-secondary-4 border'
      } px-4 py-2`}
    >
      <span
        className={`text-sm tracking-wide ${
          isActive
            ? 'text-primary-1 font-medium'
            : 'text-secondary-7 font-normal'
        }`}
      >
        {text}
      </span>
    </div>
  )
}
