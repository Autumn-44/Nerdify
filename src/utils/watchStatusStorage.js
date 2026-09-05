const WATCH_STATUS_KEY = 'nerdify_watch_status'

// Watch status options
export const WATCH_STATUS = {
  NOT_WATCHED: 'Not Watched',
  WATCHING: 'Watching',
  COMPLETED: 'Completed'
}

// Get all watch statuses
export const getAllWatchStatuses = () => {
  try {
    const data = localStorage.getItem(WATCH_STATUS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Get watch status for a specific movie
export const getWatchStatus = (movieId) => {
  const all = getAllWatchStatuses()
  return all[movieId] || WATCH_STATUS.NOT_WATCHED
}

// Set watch status for a movie
export const setWatchStatus = (movieId, status) => {
  const all = getAllWatchStatuses()
  all[movieId] = status
  localStorage.setItem(WATCH_STATUS_KEY, JSON.stringify(all))
}

// Automatically set to completed when rating
export const autoCompleteOnRating = (movieId) => {
  const currentStatus = getWatchStatus(movieId)
  // Only auto-complete if not already completed
  if (currentStatus !== WATCH_STATUS.COMPLETED) {
    setWatchStatus(movieId, WATCH_STATUS.COMPLETED)
  }
}

// Remove watch status
export const removeWatchStatus = (movieId) => {
  const all = getAllWatchStatuses()
  delete all[movieId]
  localStorage.setItem(WATCH_STATUS_KEY, JSON.stringify(all))
}

// Made with Bob
