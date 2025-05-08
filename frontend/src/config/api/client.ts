import axios from 'axios'
import { supabase } from './supabase'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(async config => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    }
    if (error.response?.status === 429) {
      // Handle rate limiting
      console.error('Rate limit exceeded')
    }
    return Promise.reject(error)
  }
)

export default api
