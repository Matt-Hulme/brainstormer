import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { Home, Login, ProjectDetails, ProjectsList, Search } from './pages'
import { Layout, ProtectedRoute } from './components'
import { Toast } from './components/design-system/Toast'

export const App = () => {
  return (
    <Router>
      <div className="bg-background">
        <Routes>
          {/* Public routes without sidebar */}
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />

          {/* Protected routes with Layout wrapper */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
            path="/projects"
          >
            <Route element={<ProjectsList />} index />
            <Route element={<ProjectDetails />} path=":projectId" />
            <Route element={<Search />} path=":projectId/search" />
          </Route>

          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
        <Toast />
      </div>
    </Router>
  )
}
