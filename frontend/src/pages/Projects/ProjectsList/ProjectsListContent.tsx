import { useEffect, useState } from 'react'
import { Collection, Project, SavedWord } from '@/types'
import { collectionsApi } from '@/services/api/collections'
import { ProjectCard } from './ProjectCard'

interface ProjectsListContentProps {
  projects: Project[]
}

interface EnrichedProject extends Project {
  collections: Collection[]
  savedWords: SavedWord[]
}

export const ProjectsListContent = ({ projects }: ProjectsListContentProps) => {
  const [enrichedProjects, setEnrichedProjects] = useState<EnrichedProject[]>([])
  const [loadingCollections, setLoadingCollections] = useState(true)

  // Fetch collections for all projects
  useEffect(() => {
    const fetchAllCollections = async () => {
      if (!projects?.length) {
        setEnrichedProjects([])
        setLoadingCollections(false)
        return
      }

      setLoadingCollections(true)

      try {
        // Create promises to fetch collections for each project
        const collectionsPromises = projects.map(async (project) => {
          try {
            const collections = await collectionsApi.listByProject(project.id)
            return { project, collections }
          } catch (error) {
            console.warn(`Error fetching collections for project ${project.id}:`, error)
            return { project, collections: [] }
          }
        })

        const results = await Promise.all(collectionsPromises)

        // Combine project data with collections data
        const enriched = results.map(({ project, collections }) => {
          // Extract all saved words from all collections for this project
          const allSavedWords = collections.flatMap((collection: Collection) =>
            collection.savedWords || []
          )

          return {
            ...project,
            collections,
            savedWords: allSavedWords
          }
        })

        setEnrichedProjects(enriched)
      } catch (error) {
        console.error('Error fetching collections:', error)
        // Fallback to projects without collections data
        setEnrichedProjects(projects.map(project => ({
          ...project,
          collections: [],
          savedWords: []
        })))
      } finally {
        setLoadingCollections(false)
      }
    }

    fetchAllCollections()
  }, [projects])

  if (loadingCollections) {
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
          <div className="flex items-center justify-center h-32 text-secondary-2">
            Loading Projects...
          </div>
        </div>
      </div>
    )
  }

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
            {enrichedProjects?.map((project: EnrichedProject) => (
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
