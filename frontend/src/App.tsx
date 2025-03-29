import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Search } from './pages/Search/Search'
import { SearchResults } from './pages/SearchResults/SearchResults'
import LoginPage from './components/Login/LoginPage'
import ProtectedRoute from './components/Login/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="h-screen bg-background">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
