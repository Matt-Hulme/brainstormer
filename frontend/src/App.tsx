import { Button } from '@mui/base/Button'
import { Input } from '@mui/base/Input'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold mb-4">MUI Base Test</h1>
        <Input
          slotProps={{
            input: {
              className:
                'w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            },
          }}
          placeholder="Test input..."
        />
        <Button
          slotProps={{
            root: {
              className:
                'w-full h-25 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 border border-blue-700 transition-colors',
            },
          }}
        >
          Test Button
        </Button>
      </div>
    </div>
  )
}

export default App
