import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/design-system/Button'
import { useNavigate } from 'react-router-dom'
import { ResultsCard } from '@/components/design-system/ResultsCard'

interface ProjectCardProps {
  name: string
  lastEdited: string
  collections: string[]
  savedWords: string[]
}

export const ProjectCard = ({ name, lastEdited, collections, savedWords }: ProjectCardProps) => {
  const navigate = useNavigate()
  const projectName = 'winter-is-calling' // fixed for now

  const onCardClick = () => {
    const projectUrl = `/projects/${projectName}`
    console.log(projectUrl)
    navigate(projectUrl)
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
      <Button variant="icon" className="rounded-full">
        <ArrowRight className="w-7 h-7 text-gray-500" />
      </Button>
    </ResultsCard>
  )
}
