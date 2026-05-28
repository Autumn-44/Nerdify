const DIARY_KEY = 'nerdify_diary'

// Get all diary entries
export const getDiaryEntries = () => {
  try {
    return JSON.parse(localStorage.getItem(DIARY_KEY)) || []
  } catch {
    return []
  }
}

// Add a diary entry
export const addDiaryEntry = (movie, watchedDate, rating = null, publicReview = '', privateNote = '') => {
  const entries = getDiaryEntries()
  const newEntry = {
    id: Date.now(),
    movieId: movie.id,
    movie: {
      id: movie.id,
      title: movie.title,
      poster: movie.poster,
      rating: movie.rating,
      releaseDate: movie.releaseDate,
      mediaType: movie.mediaType || 'movie', // Preserve mediaType (movie, tv, episode)
      showId: movie.showId,
      showTitle: movie.showTitle,
      seasonNumber: movie.seasonNumber,
      episodeNumber: movie.episodeNumber,
      seasonEpisodeCount: movie.seasonEpisodeCount,
      showEpisodeCount: movie.showEpisodeCount,
    },
    watchedDate: watchedDate, // Format: YYYY-MM-DD
    rating: rating, // User's rating (1-10)
    publicReview: publicReview, // Public review visible to everyone
    privateNote: privateNote, // Private note only for user
    createdAt: new Date().toISOString(),
  }
  
  entries.unshift(newEntry)
  localStorage.setItem(DIARY_KEY, JSON.stringify(entries))
  return newEntry
}

// Update a diary entry
export const updateDiaryEntry = (entryId, updates) => {
  const entries = getDiaryEntries()
  const index = entries.findIndex(e => e.id === entryId)
  
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates }
    localStorage.setItem(DIARY_KEY, JSON.stringify(entries))
    return entries[index]
  }
  return null
}

// Delete a diary entry
export const deleteDiaryEntry = (entryId) => {
  const entries = getDiaryEntries().filter(e => e.id !== entryId)
  localStorage.setItem(DIARY_KEY, JSON.stringify(entries))
}

// Get entries for a specific date
export const getEntriesByDate = (date) => {
  return getDiaryEntries().filter(e => e.watchedDate === date)
}

// Get entries for a specific month
export const getEntriesByMonth = (year, month) => {
  const entries = getDiaryEntries()
  return entries.filter(e => {
    const entryDate = new Date(e.watchedDate)
    return entryDate.getFullYear() === year && entryDate.getMonth() === month
  })
}

// Get all unique dates with entries
export const getDatesWithEntries = () => {
  const entries = getDiaryEntries()
  return [...new Set(entries.map(e => e.watchedDate))]
}

// Check if a movie was watched on a specific date
export const isMovieWatchedOnDate = (movieId, date) => {
  const entries = getDiaryEntries()
  return entries.some(e => e.movieId === movieId && e.watchedDate === date)
}

// Get total movies watched
export const getTotalMoviesWatched = () => {
  return getDiaryEntries().length
}

// Get movies watched this year
export const getMoviesWatchedThisYear = () => {
  const currentYear = new Date().getFullYear()
  return getDiaryEntries().filter(e => {
    const entryYear = new Date(e.watchedDate).getFullYear()
    return entryYear === currentYear
  }).length
}

// Calculate current watching streak
export const getWatchingStreak = () => {
  const entries = getDiaryEntries()
  if (entries.length === 0) return 0
  
  // Get all unique dates and sort them in descending order
  const uniqueDates = [...new Set(entries.map(e => e.watchedDate))].sort((a, b) =>
    new Date(b) - new Date(a)
  )
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let streak = 0
  let currentDate = new Date(today)
  
  for (const dateStr of uniqueDates) {
    const entryDate = new Date(dateStr)
    entryDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))
    
    // If this is the first entry, check if it's today or yesterday
    if (streak === 0) {
      if (diffDays === 0 || diffDays === 1) {
        streak = 1
        currentDate = new Date(entryDate)
      } else {
        break // Streak is broken
      }
    } else {
      // Check if this date is exactly one day before the current date
      if (diffDays === 1) {
        streak++
        currentDate = new Date(entryDate)
      } else if (diffDays === 0) {
        // Same day, don't increment streak but continue
        continue
      } else {
        break // Streak is broken
      }
    }
  }
  
  return streak
}

// Made with Bob
