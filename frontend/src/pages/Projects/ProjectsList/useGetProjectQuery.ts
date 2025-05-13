import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { projectsApi } from '@/services/api/projects'

interface UseGetProjectQueryReturn {
  project: Project | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useGetProjectQuery = (projectId: string): UseGetProjectQueryReturn => {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.get(projectId)
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  }
}
