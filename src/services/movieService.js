import api from './api'
import fallbackMovies from '../utils/fallbackMovies'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'
<<<<<<< HEAD
const FALLBACK_POSTER = fallbackMovies[0].poster

const toGenreArray = genres => {
  if (Array.isArray(genres)) {
    return genres.map(genre =>
      typeof genre === 'string' ? genre : genre.name
    )
  }

  if (typeof genres === 'string') {
    return genres.split(',').map(genre => genre.trim())
  }

  return []
}
=======
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2

const normalizeMovie = movie => ({
  id: movie.id,
  title: movie.title || movie.name || 'Untitled',
  overview: movie.overview || '',
  poster: movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : movie.poster || FALLBACK_POSTER,
  rating: movie.vote_average
    ? movie.vote_average.toFixed(1)
    : movie.rating || 'N/A',
  releaseDate: movie.release_date || movie.releaseDate || 'Unknown',
})

const normalizeMovieDetails = movie => {
  const trailer = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  )

  const cast = (movie.credits?.cast || []).slice(0, 12).map(person => ({
    id: person.id,
    name: person.name,
    character: person.character,
    image: person.profile_path
      ? `${IMAGE_BASE_URL}${person.profile_path}`
      : null,
  }))

  const similar = (movie.similar?.results || [])
    .slice(0, 10)
    .map(normalizeMovie)

  return {
    ...normalizeMovie(movie),
    tagline: movie.tagline || '',
    backdrop: movie.backdrop_path
      ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
      : movie.backdrop || null,
    voteCount: movie.vote_count || 0,
    runtime: movie.runtime || null,
    status: movie.status || '',
    genres: toGenreArray(movie.genres),
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    originalLanguage: movie.original_language || '',
    trailerKey: trailer ? trailer.key : null,
    cast,
    similar,
  }
}

const fallbackDetails = movie => ({
  ...normalizeMovieDetails(movie),
  status: movie.status || 'Released',
  voteCount: movie.voteCount || 0,
  cast: movie.cast || [],
  similar: fallbackMovies
    .filter(item => item.id !== movie.id)
    .slice(0, 4),
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
<<<<<<< HEAD
  try {
    const response = await api.get('/trending/movie/week')

    return response.data.results.map(normalizeMovie)
  } catch {
    return fallbackMovies.map(normalizeMovie)
  }
}

const getMovieDetails = async id => {
  const fallbackMovie =
    fallbackMovies.find(movie => String(movie.id) === String(id)) ||
    fallbackMovies[0]

  try {
    const response = await api.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos,similar' },
    })

    return normalizeMovieDetails(response.data)
  } catch {
    return fallbackDetails(fallbackMovie)
  }
}

const searchMovies = async query => {
  try {
    const response = await api.get('/search/movie', {
      params: { query },
    })

    return response.data.results.map(normalizeMovie)
  } catch {
    const normalizedQuery = query.toLowerCase()

    return fallbackMovies
      .filter(movie =>
        movie.title.toLowerCase().includes(normalizedQuery)
      )
      .map(normalizeMovie)
  }
=======
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
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
}

export default {
  getTrendingMovies,
  getMovieDetails,
  searchMovies,
}
