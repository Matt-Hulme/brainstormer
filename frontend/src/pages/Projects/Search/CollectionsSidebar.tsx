import { useCallback } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { AddCollectionChip } from '@/components'
import { Button } from '@/components/design-system/Button'
import { Project, SavedWord } from '@/types'

interface CollectionsSidebarProps {
  projectId: string
  project?: Project
  selectedCollectionId: string | null
  onCollectionSelect: (collectionId: string) => void
  onAddWord?: (word: string, collectionId: string) => Promise<void>
  onRemoveWord?: (word: string, collectionId: string) => Promise<void>
  localCollections: Record<string, Set<string>>
}

export const CollectionsSidebar = ({
  projectId,
  project,
  selectedCollectionId,
  onCollectionSelect,
  onAddWord,
  onRemoveWord,
  localCollections
}: CollectionsSidebarProps) => {
  const onRemoveWordClick = useCallback(async (word: string, collectionId: string) => {
    if (!onRemoveWord) return
    try {
      await onRemoveWord(word, collectionId)
    } catch (error) {
      console.error('Error removing word from collection:', error)
      toast.error('Failed to remove word from collection')
    }
  }, [onRemoveWord])

  // Get collections from project but use localCollections for words
  const collections = project?.collections || []

  return (
    <div className="p-4 w-[300px]">
      <div className="flex flex-col gap-[16px] h-full">
        <h3 className="color-secondary-2 text-p2">SAVED WORDS</h3>
        <div className="bg-secondary-1/30 h-[1px] w-full" />

        {collections?.length === 0 ? (
          <div className="color-secondary-1 text-p3">No words (yet)</div>
        ) : (
          collections?.map((collection) => {
            const words = localCollections[collection.id] || new Set()
            return (
              <div key={collection.id} className="space-y-[10px]">
                <div className="color-secondary-4 font-semibold text-[16px]">{collection.name}</div>
                {words.size > 0 ? (
                  Array.from(words).map((word) => (
                    <div key={word} className="color-secondary-2 flex items-center justify-between text-p3">
                      <span>{word}</span>
                      {onRemoveWord && (
                        <Button
                          variant="icon"
                          className="h-[18px] w-[18px]"
                          onClick={() => onRemoveWordClick(word, collection.id)}
                        >
                          <X size={18} />
                        </Button>
                      )}
                    </div>
                  ))
                ) : null}
                <div className="color-secondary-1 text-p3">Add word</div>
              </div>
            )
          })
        )}
        <div>
          <AddCollectionChip />
        </div>
      </div>
    </div>
  )
}
