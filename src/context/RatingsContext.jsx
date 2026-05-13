import { createContext, useCallback, useState } from 'react'
import {
  getAllRatings,
  removeRating,
  saveRating,
} from '../utils/ratingsStorage'

export const RatingsContext = createContext()

function RatingsProvider({ children }) {
  const [ratings, setRatings] = useState(() => getAllRatings())

  const rate = useCallback((movieId, value) => {
    saveRating(movieId, value)
    setRatings(prev => ({ ...prev, [movieId]: value }))
  }, [])

  const unrate = useCallback(movieId => {
    removeRating(movieId)
    setRatings(prev => {
      const next = { ...prev }
      delete next[movieId]
      return next
    })
  }, [])

  const getRating = useCallback(
    movieId => ratings[movieId] ?? null,
    [ratings]
  )

  return (
    <RatingsContext.Provider
      value={{ ratings, rate, unrate, getRating }}
    >
      {children}
    </RatingsContext.Provider>
  )
}

export default RatingsProvider
