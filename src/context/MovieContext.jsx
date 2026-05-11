import { createContext, useState } from 'react'

export const MovieContext = createContext()

function MovieProvider({ children }) {
  const [movies, setMovies] = useState([])

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
      }}
    >
      {children}
    </MovieContext.Provider>
  )
}

export default MovieProvider