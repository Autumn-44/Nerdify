const WATCHLIST_KEY = 'nerdify_watchlist'
const OLD_WATCHLIST_KEY = 'watchlist'

export const getWatchlist = () => {
  try {
    const list =
      JSON.parse(localStorage.getItem(WATCHLIST_KEY)) ||
      JSON.parse(localStorage.getItem(OLD_WATCHLIST_KEY)) ||
      []

    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export const addToWatchlist = movie => {
  const list = getWatchlist()

  if (!list.find(item => item.id === movie.id)) {
    localStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify([movie, ...list])
    )
  }
}

export const removeFromWatchlist = movieId => {
  localStorage.setItem(
    WATCHLIST_KEY,
    JSON.stringify(
      getWatchlist().filter(item => item.id !== movieId)
    )
  )
}

export const isInWatchlist = movieId =>
  getWatchlist().some(item => item.id === movieId)
