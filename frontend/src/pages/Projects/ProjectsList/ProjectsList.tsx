import { ProjectsListContent } from './ProjectsListContent'
import { ProjectsListContentEmpty } from './ProjectsListContentEmpty'
import { useGetProjectsQuery } from '@/hooks'

export const ProjectsList = () => {
  const { projects, isLoading, hasError } = useGetProjectsQuery()
  const hasProjects = projects?.length > 0

  if (isLoading) {
    return <div className="text-secondary-2 p-[30px]">Loading...</div>
  }

  if (hasError) {
    return <div className="text-red-500 p-[30px]">Failed to load projects</div>
  }

  return (
    <div className="p-[30px]">
      {hasProjects && <ProjectsListContent projects={projects} />}
      {!hasProjects && <ProjectsListContentEmpty />}
    </div>
  )
}
