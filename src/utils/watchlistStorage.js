const KEY = 'nerdify_watchlist'

export const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export const addToWatchlist = movie => {
  const list = getWatchlist()
  if (!list.find(m => m.id === movie.id)) {
    list.unshift(movie)
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}

export const removeFromWatchlist = movieId => {
  const list = getWatchlist().filter(m => m.id !== movieId)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const isInWatchlist = movieId =>
  getWatchlist().some(m => m.id === movieId)
