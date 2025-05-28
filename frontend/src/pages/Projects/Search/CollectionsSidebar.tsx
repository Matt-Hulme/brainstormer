import { useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { AddCollectionChip } from '@/components'
import { Button } from '@/components/design-system/Button'
import { Project, SavedWord, Collection } from '@/types'

interface CollectionsSidebarProps {
  projectId: string
  project?: Project
  collections?: Collection[]
  selectedCollectionId: string | null
  onCollectionSelect: (collectionId: string) => void
  onAddWord?: (word: string, collectionId: string) => Promise<void>
  onRemoveWord?: (word: string, collectionId: string) => Promise<void>
  localCollections: Record<string, Set<string>>
  isLoading?: boolean
}

export const CollectionsSidebar = ({
  projectId,
  project,
  collections,
  selectedCollectionId,
  onCollectionSelect,
  onAddWord,
  onRemoveWord,
  localCollections,
  isLoading = false
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

  // Use collections prop, fallback to project collections if not provided
  const collectionsToRender = collections || project?.collections || []

  if (isLoading) {
    return (
      <div className="p-4 w-[300px]">
        <div className="flex flex-col gap-[16px] h-full">
          <h3 className="color-secondary-2 text-p2">SAVED WORDS</h3>
          <div className="bg-secondary-1/30 h-[1px] w-full" />
          <div className="color-secondary-1 text-p3">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 w-[300px]">
      <div className="flex flex-col gap-[16px] h-full">
        <h3 className="color-secondary-2 text-p2">SAVED WORDS</h3>
        <div className="bg-secondary-1/30 h-[1px] w-full" />

        {collectionsToRender?.length === 0 ? (
          <div className="color-secondary-1 text-p3">No words (yet)</div>
        ) : (
          collectionsToRender?.map((collection) => {
            const words = localCollections[collection.id]
            return (
              <div key={collection.id} className="space-y-[10px]">
                <div className="color-secondary-4 font-semibold text-[16px]">{collection.name}</div>
                {words && words.size > 0 ? (
                  <div className="space-y-[10px]">
                    {Array.from(words).map((word) => (
                      <div key={word} className="color-secondary-2 flex items-center justify-between text-p3">
                        <span>{word}</span>
                        {onRemoveWord && (
                          <Button
                            variant="icon"
                            className="max-h-[18px] max-w-[18px]"
                            onClick={() => onRemoveWordClick(word, collection.id)}
                          >
                            <X size={18} />
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className="color-secondary-1 text-p3">Add word</div>
                  </div>
                ) : (
                  <div className="color-secondary-1 text-p3">No words (yet)</div>
                )}
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
