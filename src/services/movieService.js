import api from './api'
import fallbackMovies from '../utils/fallbackMovies'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'

const normalizeMovie = movie => ({
  id: movie.id,
  title: movie.title || movie.name || 'Untitled',
  overview: movie.overview || '',
  poster: movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '/vite.svg',
  rating: movie.vote_average
    ? movie.vote_average.toFixed(1)
    : 'N/A',
  releaseDate: movie.release_date || 'Unknown',
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

const getPopularMovies = async () => {
  const response = await api.get('/movie/popular')
  return response.data.results.map(normalizeMovie)
}

const getTopRatedMovies = async () => {
  const response = await api.get('/movie/top_rated')
  // Filter to only include movies from 2024 onwards
  const currentYear = new Date().getFullYear()
  const filtered = response.data.results.filter(movie => {
    const year = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0
    return year >= 2024 && year <= currentYear
  })
  return filtered.map(normalizeMovie)
}

const getLatestReleases = async () => {
  const response = await api.get('/movie/now_playing')
  return response.data.results.map(normalizeMovie)
}

const getUpcomingMovies = async () => {
  const response = await api.get('/movie/upcoming')
  // Filter to only show movies releasing in the future
  const today = new Date().toISOString().split('T')[0]
  const filtered = response.data.results.filter(movie => {
    return movie.release_date && movie.release_date > today
  })
  // Sort by release date (closest first)
  filtered.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
  return filtered.map(normalizeMovie)
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

const getActorDetails = async actorId => {
  const response = await api.get(`/person/${actorId}`, {
    params: { append_to_response: 'movie_credits' },
  })
  
  const actor = response.data
  const movies = (actor.movie_credits?.cast || [])
    .filter(movie => movie.poster_path) // Only include movies with posters
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0)) // Sort by popularity
    .map(normalizeMovie)
  
  return {
    id: actor.id,
    name: actor.name,
    biography: actor.biography || '',
    birthday: actor.birthday || null,
    placeOfBirth: actor.place_of_birth || '',
    profileImage: actor.profile_path
      ? `${IMAGE_BASE_URL}${actor.profile_path}`
      : null,
    knownFor: actor.known_for_department || '',
    movies,
  }
}

export default {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getLatestReleases,
  getUpcomingMovies,
  getMovieDetails,
  searchMovies,
  getActorDetails,
}

// Made with Bob
