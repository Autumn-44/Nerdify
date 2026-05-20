// Episode storage utilities for TV shows
const EPISODES_KEY = 'letterboxd_episodes'

export const episodeStorage = {
  // Get all episode logs
  getAll: () => {
    try {
      const data = localStorage.getItem(EPISODES_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading episodes from localStorage:', error)
      return []
    }
  },

  // Get episodes for a specific show
  getByShowId: (showId) => {
    const episodes = episodeStorage.getAll()
    return episodes.filter(ep => ep.showId === showId)
  },

  // Get a specific episode
  getEpisode: (showId, seasonNumber, episodeNumber) => {
    const episodes = episodeStorage.getAll()
    return episodes.find(
      ep => ep.showId === showId && 
           ep.seasonNumber === seasonNumber && 
           ep.episodeNumber === episodeNumber
    )
  },

  // Log an episode
  logEpisode: (episodeData) => {
    try {
      const episodes = episodeStorage.getAll()
      const existingIndex = episodes.findIndex(
        ep => ep.showId === episodeData.showId && 
             ep.seasonNumber === episodeData.seasonNumber && 
             ep.episodeNumber === episodeData.episodeNumber
      )

      const newEpisode = {
        ...episodeData,
        loggedAt: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        episodes[existingIndex] = newEpisode
      } else {
        episodes.push(newEpisode)
      }

      localStorage.setItem(EPISODES_KEY, JSON.stringify(episodes))
      return newEpisode
    } catch (error) {
      console.error('Error saving episode to localStorage:', error)
      throw error
    }
  },

  // Remove an episode log
  removeEpisode: (showId, seasonNumber, episodeNumber) => {
    try {
      const episodes = episodeStorage.getAll()
      const filtered = episodes.filter(
        ep => !(ep.showId === showId && 
               ep.seasonNumber === seasonNumber && 
               ep.episodeNumber === episodeNumber)
      )
      localStorage.setItem(EPISODES_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Error removing episode from localStorage:', error)
      throw error
    }
  },

  // Get watch progress for a show
  getShowProgress: (showId) => {
    const episodes = episodeStorage.getByShowId(showId)
    const seasonProgress = {}

    episodes.forEach(ep => {
      if (!seasonProgress[ep.seasonNumber]) {
        seasonProgress[ep.seasonNumber] = {
          watched: 0,
          episodes: []
        }
      }
      seasonProgress[ep.seasonNumber].watched++
      seasonProgress[ep.seasonNumber].episodes.push(ep.episodeNumber)
    })

    return {
      totalEpisodesWatched: episodes.length,
      seasonProgress
    }
  },

  // Check if episode is watched
  isEpisodeWatched: (showId, seasonNumber, episodeNumber) => {
    return !!episodeStorage.getEpisode(showId, seasonNumber, episodeNumber)
  },

  // Get all watched shows with progress
  getWatchedShows: () => {
    const episodes = episodeStorage.getAll()
    const showsMap = {}

    episodes.forEach(ep => {
      if (!showsMap[ep.showId]) {
        showsMap[ep.showId] = {
          showId: ep.showId,
          showName: ep.showName,
          showPoster: ep.showPoster,
          episodes: []
        }
      }
      showsMap[ep.showId].episodes.push(ep)
    })

    return Object.values(showsMap)
  },

  // Clear all episode logs
  clearAll: () => {
    try {
      localStorage.removeItem(EPISODES_KEY)
    } catch (error) {
      console.error('Error clearing episodes from localStorage:', error)
      throw error
    }
  }
}

export default episodeStorage

// Made with Bob
