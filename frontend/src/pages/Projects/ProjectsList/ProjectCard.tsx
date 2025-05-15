import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import { useNavigate } from 'react-router-dom'
import { ResultsCard } from '@/components/design-system/ResultsCard'
import { useDeleteProjectMutation } from '@/hooks'

interface ProjectCardProps {
  name: string
  lastEdited: string
  collections: string[]
  savedWords: string[]
}

export const ProjectCard = ({ name, lastEdited, collections, savedWords }: ProjectCardProps) => {
  const navigate = useNavigate()
  const deleteProject = useDeleteProjectMutation()

  const onCardClick = () => {
    const projectUrl = `/projects/${name}`
    navigate(projectUrl)
  }

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click when deleting
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate(name)
    }
  }

  return (
    <ResultsCard onClick={onCardClick}>
      <div className="space-y-[4px]">
        <h3 className="text-h3 text-secondary-4 line-clamp-1">{name ? name : 'New Project'}</h3>
        <div className="flex flex-row items-center gap-[10px]">
          {lastEdited && (
            <>
              <span className="text-p3 text-secondary-2 line-clamp-1">
                Last edited {lastEdited}
              </span>
              <div className="h-[15px] w-[1px] bg-secondary-1" />
            </>
          )}
          {collections.length > 0 && (
            <>
              <span className="text-p3 text-secondary-2 line-clamp-1">
                Collections: {collections.join(', ')}
              </span>
              <div className="h-[15px] w-[1px] bg-secondary-1" />
            </>
          )}
          <span className="text-p3 text-secondary-2 line-clamp-1">
            {savedWords.length > 0 ? `Saved words: ${savedWords.join(', ')}` : 'Nothing yet'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 relative">
        <Button variant="text" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="icon" className="rounded-full">
          <ArrowRight className="w-7 h-7 text-gray-500" />
        </Button>
      </div>
    </ResultsCard>
  )
}
