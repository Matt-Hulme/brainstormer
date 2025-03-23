import { SearchResultLoading } from './SearchResult/SearchResultLoading'
import { useEffect, useState, useRef } from 'react'

export const SearchResultsLoading = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rowCount, setRowCount] = useState(5)
  const [itemsPerRow, setItemsPerRow] = useState(4)

  useEffect(() => {
    const calculateLayout = () => {
      if (!containerRef.current) return

      const containerHeight = window.innerHeight - 100 // Approximate space for margins/padding
      const rowHeight = 60 // 40px for component + 20px for gap

      // Calculate how many rows we can fit without scrolling
      const maxRows = Math.floor(containerHeight / rowHeight)
      setRowCount(maxRows)

      // Calculate items per row based on container width
      const containerWidth = containerRef.current.clientWidth
      const itemWidth = 150 // Approximate width of each loading item
      const gap = 20
      const itemsPerRow = Math.floor(containerWidth / (itemWidth + gap))
      setItemsPerRow(Math.max(2, itemsPerRow)) // At least 2 items per row
    }

    calculateLayout()
    window.addEventListener('resize', calculateLayout)
    return () => window.removeEventListener('resize', calculateLayout)
  }, [])

  return (
    <main className="flex flex-col items-center h-screen bg-dark-1 pb-6 px-4 overflow-hidden">
      <div ref={containerRef} className="w-full flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-5 justify-center">
          {Array.from({ length: rowCount * itemsPerRow }, (_, i) => (
            <div key={`placeholder-${i}`} className="h-[40px]">
              <SearchResultLoading />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
