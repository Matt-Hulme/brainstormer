import { AddCollectionChip } from '@/components'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import { useGetCollectionsQuery } from '../ProjectsList/hooks/useGetCollectionsQuery'
import { useCollectionMutations } from '../ProjectsList/hooks/useCollectionMutations'
import { useSavedWordMutations } from '../ProjectsList/hooks/useSavedWordMutations'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface ProjectSearchCollectionsSidebarProps {
  projectId: string
  activeWords: string[]
  onRemoveWord?: (word: string) => void
}

export const ProjectSearchCollectionsSidebar = ({
  projectId,
  activeWords,
  onRemoveWord,
}: ProjectSearchCollectionsSidebarProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)

  // Fetch collections for the project
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useGetCollectionsQuery(projectId)
  const { createCollection, loading: createLoading } = useCollectionMutations()
  const { bulkSaveWords, loading: saveLoading } = useSavedWordMutations()

  const handleCreateCollection = async () => {
    try {
      const newCollection = await createCollection({
        name: searchQuery,
        projectId,
      })
      setSelectedCollectionId(newCollection.id)
      toast.success('Collection created')
    } catch {
      // Error is already handled by the mutation hook and displayed via toast
    }
  }

  const handleSaveWords = async () => {
    if (!selectedCollectionId) {
      toast.error('Please select a collection first')
      return
    }

    try {
      await bulkSaveWords(activeWords, selectedCollectionId)
      toast.success('Words saved successfully')
      if (onRemoveWord) {
        activeWords.forEach(word => onRemoveWord(word))
      }
    } catch {
      // Error is already handled by the mutation hook and displayed via toast
    }
  }

  if (collectionsError) {
    return (
      <aside className="px-[30px] py-[10px] space-y-[15px] min-w-[244px] h-full">
        <p className="text-p3 text-red-500">Failed to load collections</p>
      </aside>
    )
  }

  return (
    <aside className="px-[30px] py-[10px] space-y-[15px] min-w-[244px] h-full">
      <div className="flex justify-between items-center">
        <p className="text-p3 text-secondary-2">SAVED WORDS</p>
      </div>
      <div className="w-full h-[1px] bg-secondary-1/20" />

      {/* Collections List */}
      {!collectionsLoading && collections.length > 0 && (
        <div className="space-y-[10px]">
          <p className="text-p3 text-secondary-2">SELECT COLLECTION</p>
          {collections.map(collection => (
            <div
              key={collection.id}
              className={`cursor-pointer p-2 rounded ${
                selectedCollectionId === collection.id ? 'bg-secondary-1/10' : ''
              }`}
              onClick={() => setSelectedCollectionId(collection.id)}
            >
              <p className="text-p3 text-secondary-4">{collection.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Words */}
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

          {/* Save Actions */}
          <div className="space-y-[10px]">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleSaveWords}
              disabled={!selectedCollectionId || saveLoading}
            >
              Save to Collection
            </Button>
            <AddCollectionChip
              onClick={handleCreateCollection}
              className="w-full"
              disabled={createLoading}
            />
          </div>
        </>
      )}

      {/* Empty State */}
      {activeWords.length === 0 && <p className="text-p3 text-secondary-1">No words (yet)</p>}
    </aside>
  )
}
