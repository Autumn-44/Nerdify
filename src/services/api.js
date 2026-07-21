import axios from 'axios'

const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY

if (!tmdbApiKey) {
  console.error('❌ TMDB API Key is missing! Please add VITE_TMDB_API_KEY to your .env file')
  console.error('Get your API Read Access Token from: https://www.themoviedb.org/settings/api')
}

// Check if it's a Bearer token (JWT) or API key
// Bearer tokens start with 'eyJ' (base64 encoded JWT)
const isBearer = tmdbApiKey && tmdbApiKey.startsWith('eyJ')

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  headers: {
    accept: 'application/json',
  },
  // Only add api_key param if using old API key format
  params: isBearer ? {} : { api_key: tmdbApiKey },
})

// Add Bearer token header if using new token format
if (isBearer) {
  api.defaults.headers.Authorization = `Bearer ${tmdbApiKey}`
}

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response
      
      // Handle specific TMDB API errors
      if (status === 401) {
        console.error('❌ TMDB API Authentication Failed!')
        console.error('Your API key/token is invalid or expired.')
        console.error('Please get a new API Read Access Token from: https://www.themoviedb.org/settings/api')
      } else if (status === 404) {
        console.error('❌ Resource not found:', error.config.url)
      } else if (status === 429) {
        console.error('❌ Rate limit exceeded. Please wait before making more requests.')
      } else {
        console.error(`❌ TMDB API Error (${status}):`, data?.status_message || error.message)
      }
    } else if (error.request) {
      console.error('❌ Network error: Unable to reach TMDB API')
      console.error('Please check your internet connection')
    } else {
      console.error('❌ Request error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api

