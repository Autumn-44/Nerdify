const RATINGS_KEY = 'nerdify_ratings'

export const getAllRatings = () => {
  try {
    const data = localStorage.getItem(RATINGS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export const saveRating = (movieId, rating) => {
  const all = getAllRatings()
  all[movieId] = rating
  localStorage.setItem(RATINGS_KEY, JSON.stringify(all))
}

export const removeRating = movieId => {
  const all = getAllRatings()
  delete all[movieId]
  localStorage.setItem(RATINGS_KEY, JSON.stringify(all))
}
