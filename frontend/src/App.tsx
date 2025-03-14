import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<div>Welcome to Brainstormer</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
