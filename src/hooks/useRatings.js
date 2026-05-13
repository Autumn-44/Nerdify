import { useContext } from 'react'
import { RatingsContext } from '../context/RatingsContext'

function useRatings() {
  return useContext(RatingsContext)
}

export default useRatings
