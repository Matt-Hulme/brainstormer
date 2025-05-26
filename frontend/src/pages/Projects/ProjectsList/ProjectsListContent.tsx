import { Project } from '@/types'
import { Collection, SavedWord } from '@/types'
import { ProjectCard } from './ProjectCard'

interface ProjectsListContentProps {
  projects: Project[]
}

export const ProjectsListContent = ({ projects }: ProjectsListContentProps) => {
  return (
    <div className="flex flex-col gap-[72px] justify-center pt-[70px]">
      <header>
        <h1 className="max-w-[724px] text-h1 color-red">
          Welcome back. <br />
          Time to brainstorm.
        </h1>
      </header>
      <div className="space-y-[20px]">
        <div className="flex flex-row items-center justify-between pr-[30px]">
          <span className="text-p3 color-secondary-2">YOUR PROJECTS</span>
          <span className="text-p3 color-secondary-2">
            Use the search bar above to start a new project
          </span>
        </div>
        <div className="flex flex-col gap-[20px]">
          <div>
            {projects?.map((project: Project) => (
              <ProjectCard
                key={project?.id ?? ''}
                id={project?.id ?? ''}
                name={project?.name ?? 'Untitled Project'}
                lastEdited={new Date(project?.updatedAt ?? '').toLocaleDateString()}
                collections={project?.collections?.map((c: Collection) => c.name) ?? []}
                savedWords={project?.savedWords?.map((w: SavedWord) => w.word) ?? []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
