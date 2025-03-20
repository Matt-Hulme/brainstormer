const maxWidth = 250
const minWidth = 80

export const SearchResultLoading = () => {
  const randomWidth =
    Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth

  return (
    <div
      className="h-8 bg-secondary-3 rounded-full animate-pulse"
      style={{ width: `${randomWidth}px` }}
    />
  )
}
