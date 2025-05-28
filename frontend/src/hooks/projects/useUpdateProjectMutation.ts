import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '@/services/api/projects'
import type { CreateProjectRequest } from '@/config/api/types'
import type { Project } from '@/types'

export const useUpdateProjectMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, data }: { projectId: string; data: CreateProjectRequest }) =>
            projectsApi.update(projectId, data),
        onSuccess: (updatedProject: Project, variables) => {
            // Update the specific project in the cache
            queryClient.setQueryData(['project', variables.projectId], updatedProject)

            // Update the projects list cache
            queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
                if (!oldData) return [updatedProject]
                return oldData.map(project =>
                    project.id === variables.projectId ? updatedProject : project
                )
            })
        }
    })
} 