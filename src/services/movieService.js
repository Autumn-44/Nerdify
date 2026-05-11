import api from './api'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

const normalizeMovie = movie => ({
  id: movie.id,
  title: movie.title || movie.name || 'Untitled',
  overview: movie.overview,
  poster: movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '/vite.svg',
  rating: movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A',
  releaseDate: movie.release_date,
})

const getTrendingMovies = async () => {
  const response = await api.get('/trending/movie/week')

  return response.data.results.map(normalizeMovie)
}

const getMovieDetails = async id => {
  const response = await api.get(`/movie/${id}`)

  return normalizeMovie(response.data)
}

const searchMovies = async query => {
  const response = await api.get('/search/movie', {
    params: { query },
  })

  return response.data.results.map(normalizeMovie)
}

export default {
  getTrendingMovies,
  getMovieDetails,
  searchMovies,
}
