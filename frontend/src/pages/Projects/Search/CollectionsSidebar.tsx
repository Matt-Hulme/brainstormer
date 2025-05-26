import { AddCollectionChip } from '@/components'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import { useGetCollectionsQuery } from '@/hooks'
import { Project, SavedWord } from '@/types'

interface CollectionsSidebarProps {
  projectId: string
  project?: Project
  selectedCollectionId: string | null
  onCollectionSelect: (collectionId: string) => void
  onAddWord?: (word: string, collectionId: string) => Promise<void>
  onRemoveWord?: (word: string, collectionId: string) => Promise<void>
}

export const CollectionsSidebar = ({
  projectId,
  project,
  selectedCollectionId,
  onCollectionSelect,
  onAddWord,
  onRemoveWord
}: CollectionsSidebarProps) => {
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useGetCollectionsQuery(project?.id ?? '')

  if (collectionsLoading) {
    return <div>Loading collections...</div>
  }

  if (collectionsError) {
    return <div>Error loading collections</div>
  }

  return (
    <div className="p-4 w-[300px]">
      <div className="flex flex-col h-full gap-[16px]">
        <h3 className="color-secondary-2 text-p2 mb-2 border-b border-secondary-1/30 pb-2">SAVED WORDS</h3>
        {collections?.length === 0 ? (
          <div className="text-p3 color-secondary-1 mb-4">No words (yet)</div>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="mb-4">
              <div className="font-semibold text-[16px] color-secondary-4 mb-1">{collection.name}</div>
              {collection.savedWords && collection.savedWords.length > 0 ? (
                collection.savedWords.map((savedWord: SavedWord) => (
                  <div key={savedWord.id} className="text-p3 color-secondary-2 flex items-center justify-between">
                    <span>{savedWord.word}</span>
                    {onRemoveWord && (
                      <Button
                        variant="icon"
                        className="h-6 w-6"
                        onClick={() => onRemoveWord(savedWord.word, collection.id)}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                ))
              ) : null}
              <div className="text-p3 color-secondary-1 mt-1">Add word</div>
            </div>
          ))
        )}
        <div>
          <AddCollectionChip />
        </div>
      </div>
    </div>
  )
}
