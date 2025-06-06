import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Edit2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { AddCollectionChip } from '@/components'
import { AutoSizeInput, Button } from '@/components'
import { useDeleteCollectionMutation, useUpdateProjectMutation, useCreateCollectionMutation } from '@/hooks'
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
  const updateProjectMutation = useUpdateProjectMutation()
  const { createCollection } = useCreateCollectionMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

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

  const onEditClick = () => {
    if (!project) return
    setEditValue(project.name)
    setIsEditing(true)
  }

  const onCancelEdit = () => {
    setIsEditing(false)
    setEditValue('')
  }

  const onSaveEdit = async () => {
    if (!project) return

    if (!editValue.trim()) {
      toast.error('Project name cannot be empty')
      return
    }

    if (editValue.trim() === project.name) {
      setIsEditing(false)
      return
    }

    try {
      await updateProjectMutation.mutateAsync({
        projectId: project.id,
        data: { name: editValue.trim() }
      })
      setIsEditing(false)
      toast.success('Project name updated')
    } catch (error) {
      console.error('Error updating project name:', error)
      toast.error('Failed to update project name')
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveEdit()
    } else if (e.key === 'Escape') {
      onCancelEdit()
    }
  }

  const onAddCollectionClick = useCallback(() => {
    // Clear search bar and focus it for new collection creation
    if (onAddCollection) {
      onAddCollection()
    }
  }, [onAddCollection])

  // Use collections prop, fallback to project collections if not provided
  const collectionsToRender = collections || project?.collections || []

  if (isLoading) {
    return (
      <div className="w-[300px] pr-[10px]">
        <div className="flex flex-col gap-[16px] h-full">
          <div className="color-secondary-2 text-h3">Loading...</div>
          <div className="bg-secondary-1/30 h-[1px] w-full" />
          <div className="color-secondary-1 text-p3">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[300px] pr-[10px]">
      <div className="flex flex-col gap-[16px] h-full">
        {/* Editable Project Name */}
        {project && (
          <div className="flex items-center gap-[8px]">
            {isEditing ? (
              <div className="flex items-center gap-[8px] w-full">
                <AutoSizeInput
                  ref={inputRef}
                  className="text-h3 text-secondary-4 flex-1 min-w-0 max-w-[212px]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  value={editValue}
                />
                <Button
                  className="color-green-500 flex-shrink-0"
                  onClick={onSaveEdit}
                  variant="icon"
                >
                  <Check size={16} />
                </Button>
                <Button
                  className="color-secondary-3 flex-shrink-0"
                  onClick={onCancelEdit}
                  variant="icon"
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-[8px] group">
                <h3 className="text-h3 color-secondary-4 truncate flex-1 min-w-0 max-w-[247px]">{project.name}</h3>
                <Button
                  className="opacity-0 group-hover:opacity-100 transition-opacity color-secondary-3 flex-shrink-0"
                  onClick={onEditClick}
                  variant="icon"
                >
                  <Edit2 size={16} />
                </Button>
              </div>
            )}
          </div>
        )}

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
          <AddCollectionChip
            onClick={onAddCollectionClick}
          />
        </div>
      </div>
    </div>
  )
}
