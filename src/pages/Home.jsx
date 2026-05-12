import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'
import movieService from '../services/movieService'

function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    movieService
      .getTrendingMovies()
      .then(data => setMovies(data))
      .catch(() => setError('Could not load trending movies.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <MainLayout>
      <div className='relative -mx-8 -mt-6 mb-12 px-8 py-16 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-transparent pointer-events-none' />
        <div className='absolute -top-20 -right-20 w-96 h-96 bg-green-400/5 rounded-full blur-3xl pointer-events-none' />

        <div className='relative max-w-2xl'>
          <div className='inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-4'>
            <span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse' />
            Updated weekly
          </div>

          <h1 className='text-5xl font-black leading-tight mb-4'>
            Discover what the{' '}
            <span className='text-green-400'>world is watching</span>
          </h1>

          <p className='text-gray-400 text-lg mb-8'>
            Track films you've seen, save ones to watch, and rate everything — your personal cinema diary.
          </p>

          <div className='flex gap-3'>
            <Link
              to='/search'
              className='px-5 py-2.5 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors'
            >
              Find a movie
            </Link>
            <Link
              to='/watchlist'
              className='px-5 py-2.5 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors'
            >
              My Watchlist
            </Link>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <span className='text-xl'>🔥</span>
            <h2 className='text-2xl font-black'>Trending This Week</h2>
          </div>
          <div className='flex-1 h-px bg-white/5' />
        </div>

        {loading && <Loader />}
        {error && <p className='text-red-400'>{error}</p>}
        {!loading && !error && <MovieGrid movies={movies} />}
      </div>
    </MainLayout>
  )
}

export default Home
