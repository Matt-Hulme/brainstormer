import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, ProjectsListLayout, NewProject, ProjectDetail, ProjectSearch } from './pages'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsListLayout />} />
          <Route path="/projects/new" element={<NewProject />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/projects/:projectId/search" element={<ProjectSearch />} />
        </Routes>
      </div>
    </Router>
  )
}
