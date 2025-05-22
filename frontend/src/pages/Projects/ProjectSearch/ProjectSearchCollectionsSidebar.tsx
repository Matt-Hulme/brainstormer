import { AddCollectionChip } from '@/components'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import {
  useGetCollectionsQuery,
  useAddWordToCollectionMutation
} from '@/hooks'
import { Collection, Project } from '@/types'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface ProjectSearchCollectionsSidebarProps {
  projectName: string
  activeWords: string[]
  onRemoveWord?: (word: string) => void
  onWordAdded?: (word: string) => void
  project?: Project
  onCollectionSelect?: (collectionId: string) => void
}

export const ProjectSearchCollectionsSidebar = ({
  projectName,
  activeWords,
  onRemoveWord,
  onWordAdded,
  project,
  onCollectionSelect
}: ProjectSearchCollectionsSidebarProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
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
          onWordAdded?.(word)
        }
        setLastProcessedWords(activeWords)
      } catch (error) {
        console.error('Error saving words:', error)
        toast.error('Failed to save words to collection')
      }
    }

    saveWords()
  }, [activeWords, selectedCollectionId, lastProcessedWords, addWordToCollection, onWordAdded])

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
    <aside className="w-[300px] p-4 border-l border-secondary-1/20">
      <h4 className="text-h4 text-secondary-4 mb-4">Collections</h4>

      {/* Collection List */}
      <div className="space-y-2 mb-6">
        {collections?.map((collection: Collection) => (
          <Button
            key={collection.id}
            variant="text"
            className={`w-full justify-start ${selectedCollectionId === collection.id ? 'bg-secondary-0' : ''}`}
            onClick={() => handleCollectionSelect(collection.id)}
          >
            {collection.name}
          </Button>
        ))}
      </div>

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
                  onClick={() => onRemoveWord?.(word)}
                  aria-label={`Remove ${word}`}
                  tabIndex={-1}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>

          {/* Collection Management */}
          <div className="space-y-[10px]">
            <AddCollectionChip
              onClick={() => { }}
              className="w-full"
              disabled={true}
            />
          </div>
        </>
      )}

      {/* Empty State */}
      {activeWords.length === 0 && <p className="text-p3 text-secondary-1">No words (yet)</p>}
    </aside>
  )
}
