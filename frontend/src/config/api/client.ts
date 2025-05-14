import axios, { AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Ensure the API URL has the correct format
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Make sure the URL ends with /api/v1
  if (url.endsWith('/api/v1')) {
    return url
  } else if (url.endsWith('/')) {
    return `${url}api/v1`
  } else {
    return `${url}/api/v1`
  }
}

// Create API instance
const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Handle request interceptors
api.interceptors.request.use(
  config => {
    // Add auth token to requests if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log the full URL for debugging
    const baseUrl = config.baseURL || ''
    const url = config.url || ''
    console.log('Making API request to:', baseUrl + url)

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error.message, error.config?.url)

    if (error.response?.status === 401) {
      // Handle unauthorized access
      toast.error('Session expired. Please log in again.')
      // Clear stored auth data
      localStorage.removeItem('token')
      localStorage.removeItem('anonymousId')
      // Redirect to login
      window.location.href = '/login'
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers['retry-after'] || 60
      toast.error(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`)

      // Add rate limit info to error for component handling
      error.isRateLimit = true
      error.retryAfter = retryAfter
    } else if (error.response?.status >= 500) {
      // Handle server errors
      toast.error('Server error. Please try again later.')
    } else {
      // Handle other errors
      toast.error(error.response?.data?.detail || 'An error occurred. Please try again.')
    }
    return Promise.reject(error)
  }
)

export default api
