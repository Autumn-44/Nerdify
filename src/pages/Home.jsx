import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'
import movieService from '../services/movieService'

function MovieSection({ title, subtitle, icon, movies, loading, error }) {
  if (loading) return <Loader />
  if (error) return null
  if (!movies.length) return null

  return (
    <div className='mb-16'>
      <div className='flex items-center gap-4 mb-6'>
        <div>
          <h2 className='text-2xl font-black flex items-center gap-2' style={{ color: '#e6edf3', letterSpacing: '-0.02em' }}>
            <span className='text-3xl'>{icon}</span>
            {title}
          </h2>
          <p className='text-sm mt-1' style={{ color: '#8b949e' }}>{subtitle}</p>
        </div>
        <div className='flex-1 h-px' style={{ background: 'linear-gradient(to right, rgba(74,222,128,0.2), transparent)' }} />
      </div>
      <MovieGrid movies={movies.slice(0, 12)} />
    </div>
  )
}

function Home() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [latestReleases, setLatestReleases] = useState([])
  const [upcoming, setUpcoming] = useState([])
  
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [loadingTopRated, setLoadingTopRated] = useState(true)
  const [loadingLatestReleases, setLoadingLatestReleases] = useState(true)
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  
  const [errorTrending, setErrorTrending] = useState('')
  const [errorPopular, setErrorPopular] = useState('')
  const [errorTopRated, setErrorTopRated] = useState('')
  const [errorLatestReleases, setErrorLatestReleases] = useState('')
  const [errorUpcoming, setErrorUpcoming] = useState('')

  useEffect(() => {
    // Fetch Trending
    movieService
      .getTrendingMovies()
      .then(data => setTrending(data))
      .catch(() => setErrorTrending('Could not load trending movies.'))
      .finally(() => setLoadingTrending(false))

    // Fetch Popular
    movieService
      .getPopularMovies()
      .then(data => setPopular(data))
      .catch(() => setErrorPopular('Could not load popular movies.'))
      .finally(() => setLoadingPopular(false))

    // Fetch Top Rated (2024+)
    movieService
      .getTopRatedMovies()
      .then(data => setTopRated(data))
      .catch(() => setErrorTopRated('Could not load top rated movies.'))
      .finally(() => setLoadingTopRated(false))

    // Fetch Latest Releases
    movieService
      .getLatestReleases()
      .then(data => setLatestReleases(data))
      .catch(() => setErrorLatestReleases('Could not load latest releases.'))
      .finally(() => setLoadingLatestReleases(false))

    // Fetch Upcoming
    movieService
      .getUpcomingMovies()
      .then(data => setUpcoming(data))
      .catch(() => setErrorUpcoming('Could not load upcoming movies.'))
      .finally(() => setLoadingUpcoming(false))
  }, [])

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className='relative -mx-6 md:-mx-10 -mt-6 px-6 md:px-10 pt-20 pb-20 mb-16 overflow-hidden'>
        {/* Animated Background */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute inset-0' style={{
            background: 'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(74,222,128,0.08) 0%, transparent 60%)',
          }} />
          <div className='absolute top-0 right-0 w-[700px] h-[700px] opacity-40' style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
          }} />
          <div className='absolute bottom-0 left-0 w-[500px] h-[500px] opacity-30' style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          }} />
        </div>

        <div className='relative max-w-3xl'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-8 border backdrop-blur-sm'
            style={{ 
              color: '#4ade80', 
              background: 'rgba(74,222,128,0.1)', 
              borderColor: 'rgba(74,222,128,0.3)',
              boxShadow: '0 0 20px rgba(74,222,128,0.1)'
            }}>
            <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            Updated Daily with Fresh Content
          </div>

          {/* Main Heading */}
          <h1 className='text-6xl md:text-7xl font-black leading-[1.05] mb-6'
            style={{ letterSpacing: '-0.04em', color: '#e6edf3' }}>
            Your Ultimate{' '}
            <span style={{
              background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Cinema Hub
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-xl mb-10 leading-relaxed max-w-2xl' style={{ color: '#8b949e' }}>
            Discover, rate, and track movies. Build your watchlist, explore trending films, and never miss what's hot in cinema.
          </p>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-4'>
            <Link
              to='/search'
              className='group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl'
              style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)', color: '#0d1117' }}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-5 h-5 group-hover:scale-110 transition-transform'>
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              Explore Movies
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-4 h-4 group-hover:translate-x-1 transition-transform'>
                <line x1='5' y1='12' x2='19' y2='12' />
                <polyline points='12 5 19 12 12 19' />
              </svg>
            </Link>
            
            <Link
              to='/watchlist'
              className='group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-base border-2 transition-all duration-200 backdrop-blur-sm'
              style={{ 
                color: '#e6edf3', 
                borderColor: 'rgba(74,222,128,0.3)', 
                background: 'rgba(74,222,128,0.05)' 
              }}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-5 h-5 group-hover:scale-110 transition-transform'>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
              My Watchlist
            </Link>
          </div>

          {/* Stats */}
          <div className='flex flex-wrap gap-8 mt-12 pt-8 border-t' style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div>
              <div className='text-3xl font-black' style={{ color: '#4ade80' }}>10K+</div>
              <div className='text-sm' style={{ color: '#8b949e' }}>Movies Available</div>
            </div>
            <div>
              <div className='text-3xl font-black' style={{ color: '#22d3ee' }}>Daily</div>
              <div className='text-sm' style={{ color: '#8b949e' }}>Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Sections */}
      <MovieSection
        title="Trending This Week"
        subtitle="Most-watched movies right now"
        icon="🔥"
        movies={trending}
        loading={loadingTrending}
        error={errorTrending}
      />

      <MovieSection
        title="Top Rated Recent Films"
        subtitle="Highest rated movies from 2024 onwards"
        icon="⭐"
        movies={topRated}
        loading={loadingTopRated}
        error={errorTopRated}
      />

      <MovieSection
        title="Popular Right Now"
        subtitle="What everyone's talking about"
        icon="🎬"
        movies={popular}
        loading={loadingPopular}
        error={errorPopular}
      />

      <MovieSection
        title="Latest Releases"
        subtitle="Recently released movies"
        icon="🎭"
        movies={latestReleases}
        loading={loadingLatestReleases}
        error={errorLatestReleases}
      />

      <MovieSection
        title="Coming Soon"
        subtitle="Upcoming releases to watch for"
        icon="🎪"
        movies={upcoming}
        loading={loadingUpcoming}
        error={errorUpcoming}
      />
    </MainLayout>
  )
}

export default Home

// Made with Bob
