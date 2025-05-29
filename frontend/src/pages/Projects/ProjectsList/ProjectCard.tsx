import { ArrowRight, Check, Edit2, Trash, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '@/components/design-system/Button'
import { Input } from '@/components/design-system/Input'
import { ResultsCard } from '@/components/design-system/ResultsCard'
import { useDeleteProjectMutation, useUpdateProjectMutation } from '@/hooks'

interface ProjectCardProps {
  id: string
  collections: string[]
  lastEdited: string
  name: string
  savedWords: string[]
}

export const ProjectCard = ({ id, collections, lastEdited, name, savedWords }: ProjectCardProps) => {
  const navigate = useNavigate()
  const deleteProject = useDeleteProjectMutation()
  const updateProjectMutation = useUpdateProjectMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const onCardClick = () => {
    if (isEditing) return // Don't navigate when editing
    const projectUrl = `/projects/${id}`
    navigate(projectUrl)
  }

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate(id)
    }
  }

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(name || 'New Project')
    setIsEditing(true)
  }

  const onCancelEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsEditing(false)
    setEditValue('')
  }

  const onSaveEdit = async (e?: React.MouseEvent) => {
    e?.stopPropagation()

    if (!editValue.trim()) {
      toast.error('Project name cannot be empty')
      return
    }

    if (editValue.trim() === name) {
      setIsEditing(false)
      return
    }

    try {
      await updateProjectMutation.mutateAsync({
        projectId: id,
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

  const onInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <ResultsCard onClick={onCardClick}>
      <div className="flex flex-row items-center justify-between w-full">
        <div className="space-y-[4px]">
          {isEditing ? (
            <div className="flex items-center gap-[8px]" onClick={onInputClick}>
              <Input
                ref={inputRef}
                className="text-h3 text-secondary-4"
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={onKeyDown}
                value={editValue}
              />
              <Button
                className="color-green-500"
                onClick={onSaveEdit}
                variant="icon"
              >
                <Check size={16} />
              </Button>
              <Button
                className="color-secondary-3"
                onClick={onCancelEdit}
                variant="icon"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-[8px] group">
              <h3 className="line-clamp-1 text-h3 text-secondary-4">{name ? name : 'New Project'}</h3>
              <Button
                className="opacity-0 group-hover:opacity-100 transition-opacity color-secondary-3"
                onClick={onEditClick}
                variant="icon"
              >
                <Edit2 size={16} />
              </Button>
            </div>
          )}
          <div className="flex flex-row gap-[10px] items-center">
            {lastEdited && (
              <>
                <span className="line-clamp-1 text-p3 text-secondary-2">
                  Last edited {lastEdited}
                </span>
                <div className="bg-secondary-1 h-[15px] w-[1px]" />
              </>
            )}
            {collections.length > 0 && (
              <>
                <span className="line-clamp-1 text-p3 text-secondary-2">
                  Collections: {collections.slice(0, 4).join(', ')}
                  {collections.length > 4 && (
                    <> +{collections.length - 4}</>
                  )}
                </span>
                <div className="bg-secondary-1 h-[15px] w-[1px]" />
              </>
            )}
            <span className="line-clamp-1 text-p3 text-secondary-2">
              {savedWords.length > 0
                ? <>
                  Saved words: {savedWords.slice(0, 4).join(', ')}
                  {savedWords.length > 4 && (
                    <> +{savedWords.length - 4}</>
                  )}
                </>
                : 'Nothing yet'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center relative">
          <Button
            aria-label="Delete project"
            className="mr-[4px]"
            onClick={onDelete}
            variant="icon"
          >
            <Trash className="h-5 text-gray-500 w-5" />
          </Button>
          <Button className="rounded-full" variant="icon">
            <ArrowRight className="h-7 text-gray-500 w-7" />
          </Button>
        </div>
      </div>
    </ResultsCard>
  )
}
