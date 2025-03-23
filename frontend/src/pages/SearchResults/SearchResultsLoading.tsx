import { SearchResultsTerm } from './SearchResultsTerm'
import { SearchResultLoading } from './SearchResult/SearchResultLoading'
import { useEffect, useState, useRef } from 'react'

interface SearchResultsLoadingProps {
  searchTerm: string
}

export const SearchResultsLoading = ({
  searchTerm,
}: SearchResultsLoadingProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rowData, setRowData] = useState<Array<number>>([])

  // Calculate complete rows that will fit in the container
  useEffect(() => {
    // Function to calculate rows
    const calculateRows = () => {
      if (!containerRef.current) return

      // Get container dimensions
      const containerHeight = containerRef.current.clientHeight
      const containerWidth = containerRef.current.clientWidth

      // Estimate dimensions
      const rowHeight = 60 // Pill height (40px) + gap (20px)
      const avgPillWidth = 150 // Average pill width
      const gap = 20 // Gap between pills

      // Calculate how many complete rows will fit
      const maxRows = Math.floor(containerHeight / rowHeight)

      // Calculate average number of pills per row
      const pillsPerRow = Math.floor(containerWidth / (avgPillWidth + gap))

      // Generate varying pill counts for each row
      const newRowData = Array.from({ length: maxRows }, () =>
        // Random number of pills per row (between 70% and 100% of max)
        Math.floor((Math.random() * 0.3 + 0.7) * pillsPerRow)
      )

      setRowData(newRowData)
    }

    // Calculate on mount and window resize
    calculateRows()
    window.addEventListener('resize', calculateRows)
    return () => window.removeEventListener('resize', calculateRows)
  }, [])

  return (
    <main className="flex flex-col gap-8 items-center h-screen bg-dark-1 pt-10 pb-6 px-4">
      {/* Search term at the top */}
      <div className="mt-5">
        <SearchResultsTerm searchTerm={searchTerm} />
      </div>

      {/* Pills container with complete rows */}
      <div
        ref={containerRef}
        className="w-full flex-1 flex flex-col items-center gap-5 overflow-hidden"
      >
        {rowData.map((pillCount, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex justify-center gap-5 w-full"
          >
            {Array.from({ length: pillCount }).map((_, colIndex) => (
              <SearchResultLoading key={`pill-${rowIndex}-${colIndex}`} />
            ))}
          </div>
        ))}
      </div>
    </main>
  )
}

