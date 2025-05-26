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
  } = useGetCollectionsQuery(projectId)

  if (collectionsLoading) {
    return <div>Loading collections...</div>
  }

  if (collectionsError) {
    return <div>Error loading collections</div>
  }

  return (
    <div className="p-4 w-[300px]">
      <div className="flex flex-col gap-[16px] h-full">
        <h3 className="color-secondary-2 text-p2">SAVED WORDS</h3>
        <div className="bg-secondary-1/30 h-[1px] w-full" />

        {collections?.length === 0 ? (
          <div className="color-secondary-1 text-p3">No words (yet)</div>
        ) : (
          collections.map((collection) => (
            <div key={collection.id} className="space-y-[10px]">
              <div className="color-secondary-4 font-semibold text-[16px]">{collection.name}</div>
              {collection.savedWords && collection.savedWords.length > 0 ? (
                collection.savedWords.map((savedWord: SavedWord) => (
                  <div key={savedWord.id} className="color-secondary-2 flex items-center justify-between text-p3">
                    <span>{savedWord.word}</span>
                    {onRemoveWord && (
                      <Button
                        variant="icon"
                        className="h-[18px] w-[18px]"
                        onClick={() => onRemoveWord(savedWord.word, collection.id)}
                      >
                        <X size={18} />
                      </Button>
                    )}
                  </div>
                ))
              ) : null}
              <div className="color-secondary-1 text-p3">Add word</div>
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
