<<<<<<< HEAD
import { createContext, useCallback, useState } from 'react'
import {
  getAllRatings,
  removeRating,
  saveRating,
=======
import { createContext, useState, useCallback } from 'react'
import {
  getAllRatings,
  saveRating,
  removeRating,
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
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
<<<<<<< HEAD
    <RatingsContext.Provider
      value={{ ratings, rate, unrate, getRating }}
    >
=======
    <RatingsContext.Provider value={{ ratings, rate, unrate, getRating }}>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
      {children}
    </RatingsContext.Provider>
  )
}

export default RatingsProvider
