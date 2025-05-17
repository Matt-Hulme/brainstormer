import { Project } from '@/types'
import { Collection, SavedWord } from '@/types'
import { ProjectCard } from './ProjectCard'

interface ProjectsListContentProps {
  projects: Project[]
}

export const ProjectsListContent = ({ projects }: ProjectsListContentProps) => {


  return (
    <div className="flex flex-col gap-[72px] justify-center pt-[70px]">
      <h1 className="color-secondary-4 max-w-[724px] text-h1">
        Welcome back. Time to get
        started
        {/* mischievous. */}
      </h1>
      <div className="space-y-[20px]">
        <div className="flex flex-row items-center justify-between pr-[30px]">
          <span className="text-p3 text-secondary-2">YOUR PROJECTS</span>
          <span className="text-p3 text-secondary-2">
            Use the search bar above to start a new project
          </span>
        </div>
        <div className="flex flex-col gap-[20px]">
          <div>
            {projects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                lastEdited={new Date(project.updated_at).toLocaleDateString()}
                collections={project.collections?.map((c: Collection) => c.name) || []}
                savedWords={project.savedWords?.map((w: SavedWord) => w.word) || []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
