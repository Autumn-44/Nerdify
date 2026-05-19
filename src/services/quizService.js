import api from './api'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original'

/**
 * Get random popular movies for quiz questions
 */
const getRandomMovies = async (count = 20) => {
  try {
    const page = Math.floor(Math.random() * 5) + 1 // Random page 1-5
    const response = await api.get('/movie/popular', {
      params: { page },
    })
    
    // Shuffle and return requested count
    const movies = response.data.results
      .filter(m => m.poster_path && m.backdrop_path && m.vote_count > 100)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
    
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: `${IMAGE_BASE_URL}${movie.poster_path}`,
      backdrop: `${BACKDROP_BASE_URL}${movie.backdrop_path}`,
      overview: movie.overview,
      releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      popularity: movie.popularity,
    }))
  } catch (error) {
    console.error('Error fetching random movies:', error)
    return []
  }
}

/**
 * Get movie details with cast for quiz
 */
const getMovieWithCast = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits' },
    })
    
    const movie = response.data
    const cast = (movie.credits?.cast || []).slice(0, 5).map(person => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profileImage: person.profile_path
        ? `${IMAGE_BASE_URL}${person.profile_path}`
        : null,
    }))
    
    const director = movie.credits?.crew?.find(person => person.job === 'Director')
    
    return {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      overview: movie.overview,
      releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
      genres: (movie.genres || []).map(g => g.name),
      runtime: movie.runtime,
      director: director ? director.name : 'Unknown',
      cast,
      tagline: movie.tagline || '',
    }
  } catch (error) {
    console.error('Error fetching movie with cast:', error)
    return null
  }
}

/**
 * Get random popular actors for quiz
 */
const getRandomActors = async (count = 20) => {
  try {
    const page = Math.floor(Math.random() * 5) + 1
    const response = await api.get('/person/popular', {
      params: { page },
    })
    
    const actors = response.data.results
      .filter(p => p.profile_path && p.known_for && p.known_for.length > 0)
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
    
    return actors.map(actor => ({
      id: actor.id,
      name: actor.name,
      profileImage: `${IMAGE_BASE_URL}${actor.profile_path}`,
      knownFor: actor.known_for_department || 'Acting',
      knownForMovies: actor.known_for
        .filter(item => item.media_type === 'movie')
        .slice(0, 3)
        .map(movie => movie.title),
      popularity: actor.popularity,
    }))
  } catch (error) {
    console.error('Error fetching random actors:', error)
    return []
  }
}

/**
 * Get actor details with filmography
 */
const getActorWithFilmography = async (actorId) => {
  try {
    const response = await api.get(`/person/${actorId}`, {
      params: { append_to_response: 'movie_credits' },
    })
    
    const actor = response.data
    const movies = (actor.movie_credits?.cast || [])
      .filter(movie => movie.poster_path)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10)
      .map(movie => ({
        id: movie.id,
        title: movie.title,
        character: movie.character,
        releaseYear: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
      }))
    
    return {
      id: actor.id,
      name: actor.name,
      profileImage: actor.profile_path
        ? `${IMAGE_BASE_URL}${actor.profile_path}`
        : null,
      biography: actor.biography || '',
      birthday: actor.birthday || null,
      placeOfBirth: actor.place_of_birth || '',
      knownFor: actor.known_for_department || 'Acting',
      movies,
    }
  } catch (error) {
    console.error('Error fetching actor with filmography:', error)
    return null
  }
}

/**
 * Generate movie quote quiz question
 * Note: TMDB doesn't have quotes, so we'll use taglines and overview snippets
 */
const generateQuoteQuestion = async () => {
  const movies = await getRandomMovies(4)
  if (movies.length < 4) return null
  
  const correctMovie = movies[0]
  const options = movies.map(m => m.title)
  
  // Use tagline or first sentence of overview as "quote"
  const movieDetails = await getMovieWithCast(correctMovie.id)
  const quote = movieDetails?.tagline || 
                movieDetails?.overview?.split('.')[0] + '.' ||
                'A cinematic masterpiece.'
  
  return {
    type: 'quote',
    question: `Which movie is this from?`,
    quote,
    correctAnswer: correctMovie.title,
    options: options.sort(() => Math.random() - 0.5),
    movieId: correctMovie.id,
    poster: correctMovie.poster,
  }
}

/**
 * Generate Oscar/Awards trivia question
 */
const generateOscarQuestion = async () => {
  // Get highly rated movies (likely Oscar winners/nominees)
  const response = await api.get('/movie/top_rated', {
    params: { page: Math.floor(Math.random() * 3) + 1 },
  })
  
  const movies = response.data.results
    .filter(m => m.vote_average > 7.5 && m.vote_count > 1000)
    .slice(0, 4)
  
  if (movies.length < 4) return null
  
  const correctMovie = movies[0]
  const options = movies.map(m => m.title)
  
  const questionTypes = [
    {
      question: `Which movie won Best Picture at the Academy Awards?`,
      hint: `Released in ${correctMovie.release_date?.split('-')[0]}`,
    },
    {
      question: `Which critically acclaimed film has a rating of ${correctMovie.vote_average?.toFixed(1)}/10?`,
      hint: `Genre: ${correctMovie.genre_ids?.[0] || 'Drama'}`,
    },
    {
      question: `Which movie is considered one of the greatest films of all time?`,
      hint: `From ${correctMovie.release_date?.split('-')[0]}`,
    },
  ]
  
  const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)]
  
  return {
    type: 'oscar',
    question: selectedQuestion.question,
    hint: selectedQuestion.hint,
    correctAnswer: correctMovie.title,
    options: options.sort(() => Math.random() - 0.5),
    movieId: correctMovie.id,
    poster: correctMovie.poster_path ? `${IMAGE_BASE_URL}${correctMovie.poster_path}` : null,
    rating: correctMovie.vote_average?.toFixed(1),
    year: correctMovie.release_date?.split('-')[0],
  }
}

/**
 * Check if answer is correct (fuzzy matching)
 */
const checkAnswer = (userAnswer, correctAnswer) => {
  const normalize = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
  return normalize(userAnswer) === normalize(correctAnswer)
}

/**
 * Calculate score based on time and hints used
 */
const calculateScore = (timeSeconds, hintsUsed, maxHints = 3) => {
  const baseScore = 1000
  const timeBonus = Math.max(0, 500 - (timeSeconds * 5))
  const hintPenalty = hintsUsed * 100
  return Math.max(100, baseScore + timeBonus - hintPenalty)
}

export default {
  getRandomMovies,
  getMovieWithCast,
  getRandomActors,
  getActorWithFilmography,
  generateQuoteQuestion,
  generateOscarQuestion,
  checkAnswer,
  calculateScore,
}

// Made with Bob