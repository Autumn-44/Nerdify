const RATINGS_KEY = 'nerdify_ratings'

export const getAllRatings = () => {
  try {
    const data = localStorage.getItem(RATINGS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

<<<<<<< HEAD
=======
export const getRating = movieId => {
  const all = getAllRatings()
  return all[movieId] ?? null
}

>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
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
