import { Input } from '@mui/base/Input'
import { Button } from '@mui/base/Button'

function App() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xl px-4">
        <div className="relative">
          <Input
            className="w-full rounded-full bg-[#1a1a1a] text-white pl-4 pr-24 py-3 border border-gray-700 focus:outline-none focus:border-yellow-500"
            placeholder="Type your project theme (i.e. “storms”)"
          />
          <Button
            type="submit"
            className="absolute right-0 h-full top-1/2 -translate-y-1/2 px-4 py-1.5 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 text-sm font-medium w-30"
          >
            Generate
          </Button>
        </div>
      </form>
    </main>
  )
}

export default App
