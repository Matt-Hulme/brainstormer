import { ArrowRight, Trash } from 'lucide-react'
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
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate(name)
    }
  }

  return (
    <ResultsCard onClick={onCardClick}>
      <div className="space-y-[4px]">
        <h3 className="line-clamp-1 text-h3 text-secondary-4">{name ? name : 'New Project'}</h3>
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
                Collections: {collections.join(', ')}
              </span>
              <div className="bg-secondary-1 h-[15px] w-[1px]" />
            </>
          )}
          <span className="line-clamp-1 text-p3 text-secondary-2">
            {savedWords.length > 0 ? `Saved words: ${savedWords.join(', ')}` : 'Nothing yet'}
          </span>
        </div>
      </div>
      <div className="flex gap-2 items-center relative">
        <Button
          variant="icon"
          onClick={onDelete}
          aria-label="Delete project"
          className="mr-[4px]"
        >
          <Trash className="h-5 text-gray-500 w-5" />
        </Button>
        <Button variant="icon" className="rounded-full">
          <ArrowRight className="h-7 text-gray-500 w-7" />
        </Button>
      </div>
    </ResultsCard>
  )
}
