import { useParams } from 'react-router-dom'

export const ProjectDetail = () => {
  const { projectId } = useParams()
  return <div>Project Detail: {projectId}</div>
}
