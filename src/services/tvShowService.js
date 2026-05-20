import api from './api'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'

const normalizeTVShow = show => ({
  id: show.id,
  title: show.name || 'Untitled',
  overview: show.overview || '',
  poster: show.poster_path
    ? `${IMAGE_BASE_URL}${show.poster_path}`
    : '/vite.svg',
  rating: show.vote_average
    ? show.vote_average.toFixed(1)
    : 'N/A',
  releaseDate: show.first_air_date || 'Unknown',
  mediaType: 'tv',
})

const normalizeTVShowDetails = show => {
  const trailer = show.videos?.results?.find(
    v => v.type === 'Trailer' && v.site === 'YouTube'
  )

  const cast = (show.credits?.cast || []).slice(0, 12).map(person => ({
    id: person.id,
    name: person.name,
    character: person.character,
    image: person.profile_path
      ? `${IMAGE_BASE_URL}${person.profile_path}`
      : null,
  }))

  const similar = (show.similar?.results || []).slice(0, 10).map(normalizeTVShow)

  // Normalize seasons - keep raw data for fetching episodes later
  const seasons = (show.seasons || []).map(season => ({
    id: season.id,
    name: season.name,
    overview: season.overview,
    poster_path: season.poster_path,
    season_number: season.season_number,
    episode_count: season.episode_count,
    air_date: season.air_date,
  }))

  return {
    id: show.id,
    title: show.name || 'Untitled',
    tagline: show.tagline || '',
    overview: show.overview || '',
    poster: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : '/vite.svg',
    backdrop: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : null,
    rating: show.vote_average ? show.vote_average.toFixed(1) : 'N/A',
    voteCount: show.vote_count || 0,
    releaseDate: show.first_air_date || 'Unknown',
    status: show.status || '',
    genres: (show.genres || []).map(g => g.name),
    numberOfSeasons: show.number_of_seasons || 0,
    numberOfEpisodes: show.number_of_episodes || 0,
    episodeRunTime: show.episode_run_time?.[0] || null,
    originalLanguage: show.original_language || '',
    trailerKey: trailer ? trailer.key : null,
    cast,
    similar,
    seasons,
    mediaType: 'tv',
    networks: (show.networks || []).map(n => n.name),
    createdBy: (show.created_by || []).map(c => c.name),
  }
}

const getTrendingTVShows = async (page = 1) => {
  const response = await api.get('/trending/tv/week', { params: { page } })
  return {
    results: response.data.results.map(normalizeTVShow),
    page: response.data.page,
    totalPages: response.data.total_pages,
  }
}

const getPopularTVShows = async (page = 1) => {
  const response = await api.get('/tv/popular', { params: { page } })
  return {
    results: response.data.results.map(normalizeTVShow),
    page: response.data.page,
    totalPages: response.data.total_pages,
  }
}

const getTopRatedTVShows = async (page = 1) => {
  const response = await api.get('/tv/top_rated', { params: { page } })
  // Filter to only include shows from 2020 onwards
  const currentYear = new Date().getFullYear()
  const filtered = response.data.results.filter(show => {
    const year = show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : 0
    return year >= 2020 && year <= currentYear
  })
  return {
    results: filtered.map(normalizeTVShow),
    page: response.data.page,
    totalPages: response.data.total_pages,
  }
}

const getAiringTodayTVShows = async (page = 1) => {
  const response = await api.get('/tv/airing_today', { params: { page } })
  return {
    results: response.data.results.map(normalizeTVShow),
    page: response.data.page,
    totalPages: response.data.total_pages,
  }
}

const getOnTheAirTVShows = async (page = 1) => {
  const response = await api.get('/tv/on_the_air', { params: { page } })
  return {
    results: response.data.results.map(normalizeTVShow),
    page: response.data.page,
    totalPages: response.data.total_pages,
  }
}

const getTVShowDetails = async id => {
  const response = await api.get(`/tv/${id}`, {
    params: { append_to_response: 'credits,videos,similar' },
  })
  return normalizeTVShowDetails(response.data)
}

const getSeasonDetails = async (showId, seasonNumber) => {
  const response = await api.get(`/tv/${showId}/season/${seasonNumber}`)
  return response.data
}

const searchTVShows = async query => {
  const response = await api.get('/search/tv', {
    params: { query },
  })
  return response.data.results.map(normalizeTVShow)
}

export default {
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  getAiringTodayTVShows,
  getOnTheAirTVShows,
  getTVShowDetails,
  getSeasonDetails,
  searchTVShows,
}

// Made with Bob