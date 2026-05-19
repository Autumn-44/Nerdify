import api from './api'
import movieService from './movieService'

/**
 * Search for a movie on TMDB by title and year
 */
const findMovieByTitleAndYear = async (title, year) => {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query: title,
        year: year || undefined,
      },
    })

    if (response.data.results.length === 0) {
      return null
    }

    // Return the first result (usually the most relevant)
    const movie = response.data.results[0]
    return {
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? movie.release_date.split('-')[0] : '',
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    }
  } catch (error) {
    console.error(`Error finding movie: ${title} (${year})`, error)
    return null
  }
}

/**
 * Match multiple Letterboxd entries with TMDB movies
 */
const matchLetterboxdMovies = async (letterboxdEntries, onProgress) => {
  const matched = []
  const unmatched = []
  const total = letterboxdEntries.length

  for (let i = 0; i < letterboxdEntries.length; i++) {
    const entry = letterboxdEntries[i]
    
    // Call progress callback if provided
    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100),
        currentMovie: entry.title,
      })
    }

    const movie = await findMovieByTitleAndYear(entry.title, entry.year)
    
    if (movie) {
      matched.push({
        ...entry,
        tmdbId: movie.id,
        tmdbTitle: movie.title,
        tmdbPoster: movie.poster,
        tmdbRating: movie.rating,
      })
    } else {
      unmatched.push(entry)
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 250))
  }

  return { matched, unmatched }
}

/**
 * Import Letterboxd diary entries
 */
const importDiary = async (diaryEntries, onProgress) => {
  const { matched, unmatched } = await matchLetterboxdMovies(diaryEntries, onProgress)
  
  return {
    imported: matched.map(entry => ({
      movieId: entry.tmdbId,
      title: entry.tmdbTitle,
      poster: entry.tmdbPoster,
      rating: entry.rating,
      watchedDate: entry.watchedDate,
      review: entry.review,
      rewatch: entry.rewatch,
      tags: entry.tags,
    })),
    failed: unmatched,
    stats: {
      total: diaryEntries.length,
      successful: matched.length,
      failed: unmatched.length,
    },
  }
}

/**
 * Import Letterboxd ratings
 */
const importRatings = async (ratingsEntries, onProgress) => {
  const { matched, unmatched } = await matchLetterboxdMovies(ratingsEntries, onProgress)
  
  return {
    imported: matched.map(entry => ({
      movieId: entry.tmdbId,
      title: entry.tmdbTitle,
      poster: entry.tmdbPoster,
      rating: entry.rating,
      ratedDate: entry.ratedDate,
    })),
    failed: unmatched,
    stats: {
      total: ratingsEntries.length,
      successful: matched.length,
      failed: unmatched.length,
    },
  }
}

/**
 * Import Letterboxd watchlist
 */
const importWatchlist = async (watchlistEntries, onProgress) => {
  const { matched, unmatched } = await matchLetterboxdMovies(watchlistEntries, onProgress)
  
  return {
    imported: matched.map(entry => ({
      movieId: entry.tmdbId,
      title: entry.tmdbTitle,
      poster: entry.tmdbPoster,
      addedDate: entry.addedDate,
    })),
    failed: unmatched,
    stats: {
      total: watchlistEntries.length,
      successful: matched.length,
      failed: unmatched.length,
    },
  }
}

/**
 * Import Letterboxd watched films
 */
const importWatched = async (watchedEntries, onProgress) => {
  const { matched, unmatched } = await matchLetterboxdMovies(watchedEntries, onProgress)
  
  return {
    imported: matched.map(entry => ({
      movieId: entry.tmdbId,
      title: entry.tmdbTitle,
      poster: entry.tmdbPoster,
      watchedDate: entry.watchedDate,
    })),
    failed: unmatched,
    stats: {
      total: watchedEntries.length,
      successful: matched.length,
      failed: unmatched.length,
    },
  }
}

export default {
  findMovieByTitleAndYear,
  matchLetterboxdMovies,
  importDiary,
  importRatings,
  importWatchlist,
  importWatched,
}

// Made with Bob