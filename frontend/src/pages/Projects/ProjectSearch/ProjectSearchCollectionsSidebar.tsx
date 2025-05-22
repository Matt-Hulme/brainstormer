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
}

export const ProjectSearchCollectionsSidebar = ({
  projectName,
  activeWords,
  onRemoveWord,
  onWordAdded,
  project
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

  // Auto-save words to collection when activeWords changes
  useEffect(() => {
    if (!selectedCollectionId || addWordLoading) {
      console.log('Skipping word save - no collection selected or already loading')
      return
    }

    // Find new words that need to be saved
    const newWords = activeWords.filter(word => !lastProcessedWords.includes(word))
    console.log('New words to save:', newWords)

    // Save new words to collection
    if (newWords.length > 0) {
      const saveWord = async (word: string) => {
        try {
          console.log('Saving word to collection:', word, selectedCollectionId)
          await addWordToCollection(word, selectedCollectionId)
          onWordAdded?.(word)
          console.log('Word saved successfully:', word)
        } catch (error) {
          console.error('Error saving word:', error)
          // Error handling in hook
        }
      }

      // Save each new word
      newWords.forEach(word => saveWord(word))

      // Update processed words
      setLastProcessedWords(prevWords => [...prevWords, ...newWords])
    }
  }, [activeWords, selectedCollectionId, lastProcessedWords, addWordToCollection, onWordAdded, addWordLoading])

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
      {!collectionsLoading && collections?.length > 0 && (
        <div className="space-y-[10px]">
          <p className="text-p3 text-secondary-2">SELECT COLLECTION</p>
          {collections.map((collection: Collection) => (
            <div
              key={collection.id}
              className={`cursor-pointer p-2 rounded ${selectedCollectionId === collection.id ? 'bg-secondary-1/10' : ''}`}
              onClick={() => {
                setSelectedCollectionId(collection.id)
                toast.info('Collection selected! Click words to save them here.')
              }}
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
