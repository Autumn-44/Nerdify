import axios from 'axios'

const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 6000,
  headers: {
    accept: 'application/json',
  },
  params: {
    api_key: tmdbApiKey,
  },
})

export default api
