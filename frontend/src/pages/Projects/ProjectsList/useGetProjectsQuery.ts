import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { projectsApi } from '@/services/api/projects'

interface UseGetProjectsQueryReturn {
  projects: Project[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useGetProjectsQuery = (): UseGetProjectsQueryReturn => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.list()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
  }
}
