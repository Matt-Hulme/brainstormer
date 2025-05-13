import { useGetProjectsQuery } from './useGetProjectsQuery'
import { ProjectCard } from './ProjectCard'

export const ProjectsListContent = () => {
  const { projects, loading, error } = useGetProjectsQuery()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-secondary-2">Loading...</div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Failed to load projects
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[72px] justify-center pt-[70px]">
      <h1 className="color-secondary-4 max-w-[724px] text-h1">
        Welcome back. Time to get mischievous.
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
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                title={project.title}
                lastEdited={new Date(project.updated_at).toLocaleDateString()}
                collections={project.collections?.map(c => c.name) || []}
                savedWords={project.savedWords?.map(w => w.word) || []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
