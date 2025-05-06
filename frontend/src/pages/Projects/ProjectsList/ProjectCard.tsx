import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/design-system/Button'

interface ProjectCardProps {
  title: string
  lastEdited: string
  collections: string[]
  savedWords: string[]
}

export const ProjectCard = ({ title, lastEdited, collections, savedWords }: ProjectCardProps) => {
  return (
    <div className="bg-white p-[30px] flex flex-row items-center justify-between border-b border-solid border-secondary-2/20">
      <div className="space-y-[4px]">
        <h3 className="text-h3 text-secondary-4 line-clamp-1">{title ? title : 'New Project'}</h3>
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
    </div>
  )
}
