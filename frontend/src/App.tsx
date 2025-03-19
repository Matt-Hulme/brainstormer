import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Search } from './pages/Search/Search'
import { SearchResults } from './pages/Search/SearchResults/SearchResults'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

