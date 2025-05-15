import { projectsApi } from "@/services/api/projects"
import { useQuery } from "@tanstack/react-query"

export const useGetProjectsQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
  })

  return {
    projects: data ?? [],
    isLoading,
    hasError: error,
  }
}
