import { useMutation } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'
import type { CreateProjectRequest } from '@/config/api/types'
import type { Project } from '@/types'
import type { AxiosError } from 'axios'

/**
 * React Query mutation hook for creating a new project.
 *
 * Usage:
 *   const createProjectMutation = useCreateProjectMutation();
 *   createProjectMutation.mutate({ name: 'My Project' });
 */
export const useCreateProjectMutation = () => {
  return useMutation<Project, AxiosError, CreateProjectRequest>({
    mutationFn: projectsApi.create,
  })
} 