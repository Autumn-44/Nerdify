<<<<<<< HEAD
const WATCHLIST_KEY = 'nerdify_watchlist'
const OLD_WATCHLIST_KEY = 'watchlist'

export const getWatchlist = () => {
  try {
    const list =
      JSON.parse(localStorage.getItem(WATCHLIST_KEY)) ||
      JSON.parse(localStorage.getItem(OLD_WATCHLIST_KEY)) ||
      []

    return Array.isArray(list) ? list : []
=======
const KEY = 'nerdify_watchlist'

export const getWatchlist = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
  } catch {
    return []
  }
}

export const addToWatchlist = movie => {
  const list = getWatchlist()
<<<<<<< HEAD

  if (!list.find(item => item.id === movie.id)) {
    localStorage.setItem(
      WATCHLIST_KEY,
      JSON.stringify([movie, ...list])
    )
=======
  if (!list.find(m => m.id === movie.id)) {
    list.unshift(movie)
    localStorage.setItem(KEY, JSON.stringify(list))
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
  }
}

export const removeFromWatchlist = movieId => {
<<<<<<< HEAD
  localStorage.setItem(
    WATCHLIST_KEY,
    JSON.stringify(
      getWatchlist().filter(item => item.id !== movieId)
    )
  )
}

export const isInWatchlist = movieId =>
  getWatchlist().some(item => item.id === movieId)
=======
  const list = getWatchlist().filter(m => m.id !== movieId)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const isInWatchlist = movieId =>
  getWatchlist().some(m => m.id === movieId)
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
