const maxWidth = 250
const minWidth = 80

export const SearchResultLoading = () => {
  const randomWidth =
    Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth

  return (
    <div
      className="animate-pulse bg-secondary-3 h-8 rounded-full"
      style={{ width: `${randomWidth}px` }}
    />
  )
}
