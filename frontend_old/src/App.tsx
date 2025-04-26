import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Search } from './pages/Search/Search'
import { SearchResults } from './pages/SearchResults/SearchResults'
// import LoginPage from './components/Login/LoginPage' // No longer needed
// import ProtectedRoute from './components/Login/ProtectedRoute' // No longer needed

function App() {
  return (
    <Router>
      <div className="h-screen bg-background">
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route
            path="/"
            element={
              // <ProtectedRoute> // Removed wrapper
              <Search />
              // </ProtectedRoute> // Removed wrapper
            }
          />
          <Route
            path="/search"
            element={
              // <ProtectedRoute> // Removed wrapper
              <SearchResults />
              // </ProtectedRoute> // Removed wrapper
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
