import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Home, Login, ProjectDetails, ProjectsList, Search } from './pages'
import { ProtectedRoute } from './components'
import { Toast } from './components/design-system/Toast'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route
            element={
              <ProtectedRoute>
                <ProjectsList />
              </ProtectedRoute>
            }
            path="/projects"
          />
          <Route
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
            path="/projects/:projectId"
          />
          <Route
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
            path="/projects/:projectId/search"
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
        <Toast />
      </div>
    </Router>
  )
}
