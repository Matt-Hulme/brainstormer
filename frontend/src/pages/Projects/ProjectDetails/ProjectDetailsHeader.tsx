import profilePicture from '@/assets/profile-picture.png'
import { Project } from '@/types'

interface ProjectDetailsHeaderProps {
  project: Project | null
}

export const ProjectDetailsHeader = ({ project }: ProjectDetailsHeaderProps) => {
  if (!project) {
    return null
  }

  return (
    <header className="flex flex-row py-[30px] border-b-[.5px] border-secondary-2/20">
      <div className="grow space-y-[4px]">
        <h1 className="text-h3 text-secondary-4">{project.name}</h1>
        <div className="flex flex-row items-center gap-[10px]">
          <img
            src={profilePicture}
            alt="Profile"
            className="rounded-full border-1 border-secondary-4 h-[20px] w-[20px]"
          />
          <p className="text-p3 color-secondary-2">
            Last edited {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </header>
  )
}
