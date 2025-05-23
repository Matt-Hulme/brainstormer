import { AddCollectionChip } from '@/components'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import {
  useGetCollectionsQuery,
  useAddWordToCollectionMutation
} from '@/hooks'
import { Project } from '@/types'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface CollectionsSidebarProps {
  projectName: string
  activeWords: string[]
  onRemoveWord?: (word: string) => void
  project?: Project
  onCollectionSelect?: (collectionId: string) => void
}

export const CollectionsSidebar = ({
  projectName,
  activeWords,
  onRemoveWord,
  project,
  onCollectionSelect
}: CollectionsSidebarProps) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [lastProcessedWords, setLastProcessedWords] = useState<string[]>([])

  // Fetch collections for the project
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useGetCollectionsQuery(project?.id ?? '')

  const { addWordToCollection, loading: addWordLoading } = useAddWordToCollectionMutation()

  // Reset selected collection when project changes
  useEffect(() => {
    setSelectedCollectionId(null)
    setLastProcessedWords([])
  }, [projectName])

  // Auto-save words when they change
  useEffect(() => {
    if (!selectedCollectionId || !activeWords.length) return

    const newWords = activeWords.filter(word => !lastProcessedWords.includes(word))
    if (newWords.length === 0) return

    const saveWords = async () => {
      try {
        for (const word of newWords) {
          await addWordToCollection(word, selectedCollectionId)
        }
        setLastProcessedWords(activeWords)
      } catch (error) {
        console.error('Error saving words:', error)
        toast.error('Failed to save words to collection')
      }
    }

    saveWords()
  }, [activeWords, selectedCollectionId, lastProcessedWords, addWordToCollection])

  const handleCollectionSelect = (collectionId: string) => {
    setSelectedCollectionId(collectionId)
    onCollectionSelect?.(collectionId)
  }

  if (collectionsLoading) {
    return <div>Loading collections...</div>
  }

  if (collectionsError) {
    return <div>Error loading collections</div>
  }

  return (
    <div className="p-4 w-[300px]">
      <div className="flex flex-col h-full items-center justify-between gap-[16px]">
        <h3 className="color-secondary-2 text-p2">SAVED WORDS</h3>
        <AddCollectionChip />
      </div>
      <div className="flex flex-col gap-[10px]">
        {collections?.map((collection) => (
          <div
            key={collection.id}
            className={`p-2 rounded cursor-pointer ${selectedCollectionId === collection.id ? 'bg-secondary-0' : 'hover:bg-secondary-0/50'
              }`}
            onClick={() => handleCollectionSelect(collection.id)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{collection.name}</span>
              {selectedCollectionId === collection.id && (
                <Button
                  variant="icon"
                  className="w-6 h-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveWord?.()
                  }}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <div className="ml-4 mt-1">
              {collection?.savedWords?.length > 0 ? (
                collection?.savedWords?.map((word: string) => (
                  <div key={word} className="text-p3 color-secondary-2">{word}</div>
                ))
              ) : (
                <div className="text-p3 color-secondary-1">No words (yet)</div>
              )}
            </div>
          </div>
        ))}
        <span className='text-p3 color-secondary-1'>Add word</span>
      </div>
    </div>
  )
}
