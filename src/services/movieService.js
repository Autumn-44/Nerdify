import api from './api'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'

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

const normalizeMovieDetails = movie => {
  const trailer = movie.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  )

  const cast = (movie.credits?.cast || []).slice(0, 12).map(person => ({
    id: person.id,
    name: person.name,
    character: person.character,
    image: person.profile_path
      ? `${IMAGE_BASE_URL}${person.profile_path}`
      : null,
  }))

  const similar = (movie.similar?.results || []).slice(0, 10).map(normalizeMovie)

  return {
    id: movie.id,
    title: movie.title || 'Untitled',
    tagline: movie.tagline || '',
    overview: movie.overview || '',
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/vite.svg',
    backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    voteCount: movie.vote_count || 0,
    releaseDate: movie.release_date || 'Unknown',
    runtime: movie.runtime || null,
    status: movie.status || '',
    genres: (movie.genres || []).map(g => g.name),
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    originalLanguage: movie.original_language || '',
    trailerKey: trailer ? trailer.key : null,
    cast,
    similar,
  }
}

const getTrendingMovies = async () => {
  const response = await api.get('/trending/movie/week')
  return response.data.results.map(normalizeMovie)
}

const getMovieDetails = async id => {
  const response = await api.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar' },
  })
  return normalizeMovieDetails(response.data)
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
