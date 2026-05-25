import axios from 'axios'

const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY

// Check if it's a Bearer token (JWT) or API key
const isBearer = tmdbApiKey && tmdbApiKey.startsWith('eyJ')

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  headers: {
    accept: 'application/json',
  },
  params: isBearer ? {} : { api_key: tmdbApiKey },
})

// Add Bearer token if it's a JWT
if (isBearer) {
  api.defaults.headers.Authorization = `Bearer ${tmdbApiKey}`
}

export default api

