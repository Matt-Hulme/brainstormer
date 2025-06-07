import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Check, Edit2, X } from 'lucide-react'
import { AutoSizeInput, Button, ProfilePicture } from '@/components'
import { useUpdateProjectMutation } from '@/hooks'
import { Project } from '@/types'
import { toast } from 'react-toastify'

interface ProjectDetailsHeaderProps {
  project: Project | null
}

export const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const updateProjectMutation = useUpdateProjectMutation()

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  if (!project) {
    return null
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM d, yyyy')
    } catch (error) {
      console.error('Date parsing error:', error)
      return 'Unknown date'
    }
  }

  const onEditClick = () => {
    setEditValue(project.name)
    setIsEditing(true)
  }

  const onCancelEdit = () => {
    setIsEditing(false)
    setEditValue('')
  }

  const onSaveEdit = async () => {
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

  return (
    <header className="flex flex-row py-[30px] border-b-[.5px] border-secondary-2/20">
      <div className="grow space-y-[4px]">
        <div className="flex items-center gap-[8px]">
          {isEditing ? (
            <div className="flex items-center gap-[8px]">
              <AutoSizeInput
                ref={inputRef}
                className="text-h3 text-secondary-4"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                onKeyDown={onKeyDown}
                value={editValue}
              />
              <Button
                className="color-green-500"
                onClick={onSaveEdit}
                variant="icon"
              >
                <Check size={20} />
              </Button>
              <Button
                className="color-secondary-3"
                onClick={onCancelEdit}
                variant="icon"
              >
                <X size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-[8px] group">
              <h1 className="text-h3 text-secondary-4">{project.name}</h1>
              <Button
                className="opacity-0 group-hover:opacity-100 transition-opacity color-secondary-3"
                onClick={onEditClick}
                variant="icon"
              >
                <Edit2 size={16} />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-[10px]">
          <ProfilePicture />
          <p className="text-p3 color-secondary-2">
            Last edited {formatDate(project?.updatedAt ?? '')}
          </p>
        </div>
      </div>
    </header>
  )
}
