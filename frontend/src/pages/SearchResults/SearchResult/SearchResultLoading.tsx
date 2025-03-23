const maxWidth = 250
const minWidth = 80

export const SearchResultLoading = () => {
  const randomWidth =
    Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth

  return (
    <div
      className="flex flex-row items-center justify-center bg-transparent rounded-full overflow-hidden border-2 border-secondary-4 animate-pulse px-5 py-4"
      style={{ width: `${randomWidth}px` }}
    >
      <div className="h-1.5 bg-secondary-3 rounded-full w-full" />
    </div>
  )
}
