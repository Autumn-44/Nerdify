import { useEffect, useState } from 'react'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import movieService from '../services/movieService'

function Home() {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getTrendingMovies()

        setMovies(data)
      } catch (error) {
        setError('Could not load trending movies.')
      }
    }

    fetchMovies()
  }, [])

  return (
    <MainLayout>
      <div className='space-y-6'>
        <h1 className='text-4xl font-bold'>
          Trending Movies
        </h1>

        {error && (
          <p className='text-red-400'>{error}</p>
        )}

        <MovieGrid movies={movies} />
      </div>
    </MainLayout>
  )
}

export default Home
