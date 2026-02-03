import axios from 'axios'
import { supabase } from '@services/supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL.endsWith('/')
    ? import.meta.env.VITE_API_URL
    : `${import.meta.env.VITE_API_URL}/`,
})

let sessionPromise = null

// Automatically attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  // Use a singleton promise to avoid multiple parallel getSession calls
  if (!sessionPromise) {
    sessionPromise = supabase.auth.getSession()
    // Clear the promise after a short delay or when it completes
    sessionPromise.finally(() => {
      sessionPromise = null
    })
  }

  const { data: { session } } = await sessionPromise

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Handle response errors (like 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, the token is invalid or session expired
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api
