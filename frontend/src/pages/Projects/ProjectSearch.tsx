import { useParams } from 'react-router-dom'

export const ProjectSearch = () => {
  const { projectId } = useParams()
  return <div>Project Search: {projectId}</div>
}
