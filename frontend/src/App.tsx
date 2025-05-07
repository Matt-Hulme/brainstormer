import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, ProjectsList, ProjectDetails, ProjectSearch } from './pages'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:userId/projects" element={<ProjectsList />} />
          <Route path="/:userId/projects/:projectName" element={<ProjectDetails />} />
          <Route path="/:userId/projects/:projectName/search" element={<ProjectSearch />} />
        </Routes>
      </div>
    </Router>
  )
}
