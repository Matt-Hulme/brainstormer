import { useCallback } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { AddCollectionChip } from '@/components'
import { Button } from '@/components/design-system/Button'
import { useDeleteCollectionMutation } from '@/hooks'
import { Project, Collection } from '@/types'

interface CollectionsSidebarProps {
  project?: Project
  collections?: Collection[]
  onRemoveWord?: (word: string, collectionId: string) => Promise<void>
  localCollections: Record<string, Set<string>>
  isLoading?: boolean
  onAddCollection?: () => void
}

export const CollectionsSidebar = ({
  project,
  collections,
  onRemoveWord,
  localCollections,
  isLoading = false,
  onAddCollection
}: CollectionsSidebarProps) => {
  const deleteCollectionMutation = useDeleteCollectionMutation()

  const onDeleteCollection = useCallback(async (collectionId: string, collectionName: string) => {
    if (confirm(`Are you sure you want to delete the collection "${collectionName}"?`)) {
      try {
        deleteCollectionMutation.mutate(collectionId)
      } catch (error) {
        console.error('Error deleting collection:', error)
        toast.error('Failed to delete collection')
      }
    }
  }, [deleteCollectionMutation])

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
                <div className="color-secondary-4 font-semibold text-[16px] flex items-center justify-between group">
                  <span>{collection.name}</span>
                  <Button
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !h-4 !w-4 !p-0"
                    onClick={() => onDeleteCollection(collection.id, collection.name)}
                    variant="icon"
                  >
                    <X size={14} />
                  </Button>
                </div>
                {words && words.size > 0 ? (
                  <div className="space-y-[10px]">
                    {Array.from(words).map((word) => (
                      <div key={word} className="color-secondary-2 flex items-center justify-between text-p3 group">
                        <span>{word}</span>
                        {onRemoveWord && (
                          <Button
                            variant="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 !h-4 !w-4 !p-0"
                            onClick={() => onRemoveWordClick(word, collection.id)}
                          >
                            <X size={14} />
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
          <AddCollectionChip onClick={onAddCollection} />
        </div>
      </div>
    </div>
  )
}
