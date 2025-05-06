import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, ProjectsList, ProjectDetail, ProjectSearch } from './pages'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/projects/:projectId/search" element={<ProjectSearch />} />
        </Routes>
      </div>
    </Router>
  )
}
