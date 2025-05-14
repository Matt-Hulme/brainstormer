import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Home, ProjectsList, ProjectDetails, ProjectSearch, Login } from './pages'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:projectName" element={<ProjectDetails />} />
          <Route path="/projects/:projectName/search" element={<ProjectSearch />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}
