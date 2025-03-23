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
  const [rowsPerSection, setRowsPerSection] = useState(0)

  // Calculate how many rows we can fit based on viewport height
  useEffect(() => {
    const calculateRows = () => {
      // Row height including gap
      const rowHeight = 40 // Pill height
      const gapSize = 20 // gap-5 is 20px
      const totalRowHeight = rowHeight + gapSize
      const viewportHeight = window.innerHeight

      // Reserve space for the middle section with Forest
      const middleSectionHeight = 60

      // Calculate available height for top and bottom sections
      const availableHeight = viewportHeight - middleSectionHeight - 100 // Buffer for margins

      // Each section (top/bottom) gets half the remaining space
      const heightPerSection = availableHeight / 2

      // Calculate rows per section
      const rowsPerSection = Math.floor(heightPerSection / totalRowHeight)

      setRowsPerSection(rowsPerSection)
    }

    calculateRows()
    window.addEventListener('resize', calculateRows)
    return () => window.removeEventListener('resize', calculateRows)
  }, [])

  // Don't render until we've calculated rows
  if (rowsPerSection === 0) return null

  // Generate a section of rows with pills
  const renderSection = (sectionIndex: number, rowCount: number) => {
    const rows = []

    for (let i = 0; i < rowCount; i++) {
      // Determine how many pills to show in this row
      const pillCount = Math.floor(Math.random() * 4) + 7 // 7-10 pills per row

      rows.push(
        <div
          key={`row-${sectionIndex}-${i}`}
          className="flex justify-center gap-5 h-10 mb-5"
        >
          {Array.from({ length: pillCount }).map((_, index) => (
            <SearchResultLoading key={`pill-${sectionIndex}-${i}-${index}`} />
          ))}
        </div>
      )
    }

    return rows
  }

  return (
    <main
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-dark-1 overflow-hidden relative"
    >
      {/* Absolute centered Forest search term */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <SearchResultsTerm searchTerm={searchTerm} />
      </div>

      <div className="w-full h-full flex flex-col">
        {/* Top section - rows of pills */}
        <div className="flex-1 overflow-hidden flex flex-col justify-end pb-10">
          {renderSection(0, rowsPerSection)}
        </div>

        {/* Middle section - empty space to accommodate Forest */}
        <div className="h-16"></div>

        {/* Bottom section - rows of pills */}
        <div className="flex-1 overflow-hidden flex flex-col justify-start pt-10">
          {renderSection(1, rowsPerSection)}
        </div>
      </div>
    </main>
  )
}

