// Series watch status storage utilities
const SERIES_STATUS_KEY = 'letterboxd_series_status'

export const WATCH_STATUS = {
  NOT_STARTED: 'not_started',
  WATCHING: 'watching',
  COMPLETED: 'completed'
}

export const seriesStatusStorage = {
  // Get all series statuses
  getAll: () => {
    try {
      const data = localStorage.getItem(SERIES_STATUS_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error reading series status from localStorage:', error)
      return {}
    }
  },

  // Get status for a specific series
  getStatus: (seriesId) => {
    const statuses = seriesStatusStorage.getAll()
    return statuses[seriesId] || WATCH_STATUS.NOT_STARTED
  },

  // Set status for a series
  setStatus: (seriesId, status) => {
    try {
      const statuses = seriesStatusStorage.getAll()
      statuses[seriesId] = status
      localStorage.setItem(SERIES_STATUS_KEY, JSON.stringify(statuses))
    } catch (error) {
      console.error('Error saving series status to localStorage:', error)
      throw error
    }
  },

  // Remove status for a series
  removeStatus: (seriesId) => {
    try {
      const statuses = seriesStatusStorage.getAll()
      delete statuses[seriesId]
      localStorage.setItem(SERIES_STATUS_KEY, JSON.stringify(statuses))
    } catch (error) {
      console.error('Error removing series status from localStorage:', error)
      throw error
    }
  },

  // Clear all statuses
  clearAll: () => {
    try {
      localStorage.removeItem(SERIES_STATUS_KEY)
    } catch (error) {
      console.error('Error clearing series status from localStorage:', error)
      throw error
    }
  }
}

export default seriesStatusStorage

// Made with Bob