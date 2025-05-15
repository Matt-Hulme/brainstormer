import { AddCollectionChip } from '@/components'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import {
  useGetCollectionsQuery,
  useCreateCollectionMutation,
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
}

export const ProjectSearchCollectionsSidebar = ({
  projectName,
  activeWords,
  onRemoveWord,
  onWordAdded,
  project
}: ProjectSearchCollectionsSidebarProps) => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
  const [lastProcessedWords, setLastProcessedWords] = useState<string[]>([])

  // Fetch collections for the project
  const {
    collections,
    loading: collectionsLoading,
    error: collectionsError,
  } = useGetCollectionsQuery(project?.id || '')

  const { createCollection, loading: createLoading } = useCreateCollectionMutation()
  const { addWordToCollection, loading: addWordLoading } = useAddWordToCollectionMutation()

  // Reset selected collection when project changes
  useEffect(() => {
    setSelectedCollectionId(null)
    setLastProcessedWords([])
  }, [projectName])

  // Auto-save words to collection when activeWords changes
  useEffect(() => {
    if (!selectedCollectionId || addWordLoading) return

    // Find new words that need to be saved
    const newWords = activeWords.filter(word => !lastProcessedWords.includes(word))

    // Save new words to collection
    if (newWords.length > 0) {
      const saveWord = async (word: string) => {
        try {
          await addWordToCollection(word, selectedCollectionId)
          if (onWordAdded) {
            onWordAdded(word)
          }
        } catch (error) {
          // Error handling in hook
        }
      }

      // Save each new word
      newWords.forEach(word => saveWord(word))

      // Update processed words
      setLastProcessedWords(prevWords => [...prevWords, ...newWords])
    }
  }, [activeWords, selectedCollectionId, lastProcessedWords, addWordToCollection, onWordAdded, addWordLoading])

  const handleCreateCollection = async () => {
    if (!project) {
      toast.error('Project not found')
      return
    }

    try {
      const newCollection = await createCollection({
        name: searchQuery,
        projectId: project.id,
      })
      setSelectedCollectionId(newCollection.id)
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
      {!collectionsLoading && collections && collections.length > 0 && (
        <div className="space-y-[10px]">
          <p className="text-p3 text-secondary-2">SELECT COLLECTION</p>
          {collections.map((collection: Collection) => (
            <div
              key={collection.id}
              className={`cursor-pointer p-2 rounded ${selectedCollectionId === collection.id ? 'bg-secondary-1/10' : ''
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

          {/* Collection Management */}
          <div className="space-y-[10px]">
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
