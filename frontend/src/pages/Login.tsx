import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/design-system/Button'

export const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // The token endpoint is at the root level, not under /api/v1
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      // Remove /api/v1 if it's included in the URL
      const tokenUrl = baseUrl.includes('/api/v1')
        ? baseUrl.replace('/api/v1', '/token')
        : `${baseUrl}/token`

      console.log('Making token request to:', tokenUrl)

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()

      // Store the token and anonymous ID
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('anonymousId', data.anonymous_id)

      // Navigate to projects page
      navigate('/projects')
    } catch (err) {
      console.error('Login error:', err)
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row items-center justify-between p-[30px] w-full">
        <span className="color-secondary-3 text-h4">AI tools for the creative minded</span>
      </div>
      <main className="flex-grow flex items-center justify-center">
        <div className="w-[400px] p-[40px] bg-white rounded-lg shadow-lg">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <h2 className="text-h3 color-secondary-4 mb-6">Sign in to Brainstormer</h2>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-secondary-3">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-secondary-1 rounded-md text-sm shadow-sm placeholder-secondary-1 focus:outline-none focus:border-primary-3 focus:ring-1 focus:ring-primary-3"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-3">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-secondary-1 rounded-md text-sm shadow-sm placeholder-secondary-1 focus:outline-none focus:border-primary-3 focus:ring-1 focus:ring-primary-3"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
