import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Home, ProjectsList, ProjectDetails, ProjectSearch, Login } from './pages'
import { ProtectedRoute } from './components'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectName"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:projectName/search"
            element={
              <ProtectedRoute>
                <ProjectSearch />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}
