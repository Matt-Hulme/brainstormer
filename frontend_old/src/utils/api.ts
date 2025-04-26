// In production, use relative URLs that will be handled by Nginx
// In development, also use relative URLs for simplicity

/**
 * Base fetch function with authentication
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  // For production, use relative URLs that will be handled by Nginx
  const url = endpoint

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // If unauthorized, redirect to login
    if (response.status === 401 || response.status === 403) {
      // Authentication error, redirect to login
      // window.location.href = '/login' // Removed redirect
      console.error('Authentication error from API:', response.status)
      throw new Error('Authentication Required') // Throw an error to be caught by the caller
    }

    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.detail ||
        `Server error: ${response.status} ${response.statusText}`
    )
  }

  return response
}

/**
 * Login function
 */
export async function login(username: string, password: string) {
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  const url = '/token'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Invalid credentials')
  }

  const data = await response.json()
  localStorage.setItem('token', data.access_token)
  return data
}

/**
 * Generate ideas based on a prompt
 */
export async function generateIdeas(prompt: string, temperature: number = 0.7) {
  const response = await fetchWithAuth('/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      temperature,
    }),
  })

  return response.json()
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('token'))
}

/**
 * Logout user
 */
export function logout(): void {
  localStorage.removeItem('token')
  // window.location.href = '/login' // Removed redirect
}

export default {
  login,
  generateIdeas,
  isLoggedIn,
  logout,
}
