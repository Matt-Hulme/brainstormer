import { ProjectCard } from './ProjectCard'
import { projectCardsMock } from './mocks/ProjectCardsMock'
export const ProjectsListContent = () => {
  return (
    <div className="flex flex-col gap-[72px] justify-center pt-[70px]">
      <h1 className="color-secondary-4 max-w-[724px] text-h1">
        Welcome back. Time to get mischiveous.
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
            {projectCardsMock.map(projectCard => (
              <ProjectCard
                key={projectCard.title}
                title={projectCard.title}
                lastEdited={projectCard.lastEdited}
                collections={projectCard.collections}
                savedWords={projectCard.savedWords}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
