import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Search } from './pages/Search/Search'
import { SearchResults } from './pages/SearchResults/SearchResults'

function App() {
  return (
    <Router>
      <div className="h-screen bg-background">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

