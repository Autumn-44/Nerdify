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
      <div className='relative -mx-6 md:-mx-10 -mt-6 px-6 md:px-10 pt-20 pb-16 mb-14 overflow-hidden'>
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(74,222,128,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className='absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-30'
          style={{
            background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
          }}
        />

        <div className='relative max-w-2xl'>
          <div
            className='inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border'
            style={{ color: '#4ade80', background: 'rgba(74,222,128,0.08)', borderColor: 'rgba(74,222,128,0.2)' }}
          >
            <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
            Trending updated weekly
          </div>

          <h1
            className='text-5xl md:text-6xl font-black leading-[1.05] mb-5'
            style={{ letterSpacing: '-0.03em', color: '#e6edf3' }}
          >
            Your personal{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              cinema diary.
            </span>
          </h1>

          <p className='text-lg mb-8 leading-relaxed' style={{ color: '#8b949e' }}>
            Rate films, build your watchlist, and discover what the world is watching — all in one place.
          </p>

          <div className='flex flex-wrap gap-3'>
            <Link
              to='/search'
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150'
              style={{ background: '#4ade80', color: '#0d1117' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#86efac')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4ade80')}
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-4 h-4'>
                <circle cx='11' cy='11' r='8' /><line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              Find a Movie
            </Link>
            <Link
              to='/watchlist'
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all duration-150'
              style={{ color: '#e6edf3', borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              My Watchlist
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className='flex items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-black' style={{ color: '#e6edf3', letterSpacing: '-0.02em' }}>
              🔥 Trending This Week
            </h2>
            <p className='text-xs mt-0.5' style={{ color: '#8b949e' }}>Most-watched movies right now</p>
          </div>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {loading && <Loader />}
        {error && <p className='text-red-400'>{error}</p>}
        {!loading && !error && <MovieGrid movies={movies} />}
      </div>
    </MainLayout>
  )
}

export default Home
