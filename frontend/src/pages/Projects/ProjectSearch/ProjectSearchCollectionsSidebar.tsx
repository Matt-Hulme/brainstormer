import { AddCollectionChip } from '@/components'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'

interface ProjectSearchCollectionsSidebarProps {
  activeWords: string[]
  onRemoveWord?: (word: string) => void
}

export const ProjectSearchCollectionsSidebar = ({
  activeWords,
  onRemoveWord,
}: ProjectSearchCollectionsSidebarProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  return (
    <aside className="px-[30px] py-[10px] space-y-[15px] min-w-[244px] h-full">
      <div className="flex justify-between items-center">
        <p className="text-p3 text-secondary-2">SAVED WORDS</p>
      </div>
      <div className="w-full h-[1px] bg-secondary-1/20" />
      {activeWords.length === 0 && <p className="text-p3 text-secondary-1">No words (yet)</p>}
      {activeWords.length > 0 && (
        <>
          <h5 className="text-h5 text-secondary-4">{searchQuery}</h5>
          <div className="space-y-[10px]">
            {activeWords.map((word, index) => (
              <div key={`${word}-${index}`} className="flex items-center group">
                <span className="text-p3 text-secondary-4 grow">{word}</span>
                <Button
                  variant="text"
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveWord && onRemoveWord(word)}
                  aria-label={`Remove ${word}`}
                  tabIndex={-1}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
      <AddCollectionChip onClick={() => {}} />
    </aside>
  )
}
