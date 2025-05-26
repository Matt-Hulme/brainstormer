import { AddCollectionChip } from '@/components'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import {
  useGetCollectionsQuery,
  useAddWordToCollectionMutation
} from '@/hooks'
import { Project, SavedWord } from '@/types'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface CollectionsSidebarProps {
  projectId: string
  activeWords: string[]
  onRemoveWord?: (word: string) => void
  project?: Project
  onCollectionSelect?: (collectionId: string) => void
}

export const CollectionsSidebar = ({
  projectId,
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
  }, [projectId])

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
  }, [activeWords, selectedCollectionId, lastProcessedWords])

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
                  <div key={savedWord.id} className="text-p3 color-secondary-2">{savedWord.word}</div>
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
