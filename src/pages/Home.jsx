import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'
import movieService from '../services/movieService'

function SectionGroup({ label }) {
  return (
    <div className='flex items-center gap-4 mb-10 mt-4'>
      <span className='text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full'
        style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
        {label}
      </span>
      <div className='flex-1 h-px' style={{ background: 'linear-gradient(to right, rgba(251,191,36,0.15), transparent)' }} />
    </div>
  )
}

function MovieSection({ title, subtitle, movies, loading, error, onLoadMore, hasMore }) {
  const observerTarget = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading, onLoadMore])

  if (error) return null
  if (!movies.length && !loading) return null

  return (
    <div className='mb-12'>
      <div className='flex items-center gap-4 mb-5'>
        <div>
          <h2 className='text-2xl font-black' style={{ color: '#e6edf3', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          <p className='text-sm mt-1' style={{ color: '#8b949e' }}>{subtitle}</p>
        </div>
        <div className='flex-1 h-px' style={{ background: 'linear-gradient(to right, rgba(251, 191, 36,0.2), transparent)' }} />
      </div>
      <MovieGrid movies={movies} />
      {loading && (
        <div className='flex justify-center py-8'>
          <Loader />
        </div>
      )}
      {hasMore && !loading && <div ref={observerTarget} className='h-20' />}
    </div>
  )
}

function Home() {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [latestReleases, setLatestReleases] = useState([])
  const [upcoming, setUpcoming] = useState([])
  
  const [trendingPage, setTrendingPage] = useState(1)
  const [topRatedPage, setTopRatedPage] = useState(1)
  const [latestReleasesPage, setLatestReleasesPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)
  
  const [loadingTrending, setLoadingTrending] = useState(false)
  const [loadingTopRated, setLoadingTopRated] = useState(false)
  const [loadingLatestReleases, setLoadingLatestReleases] = useState(false)
  const [loadingUpcoming, setLoadingUpcoming] = useState(false)
  
  const [hasMoreTrending, setHasMoreTrending] = useState(true)
  const [hasMoreTopRated, setHasMoreTopRated] = useState(true)
  const [hasMoreLatestReleases, setHasMoreLatestReleases] = useState(true)
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true)
  
  const [errorTrending, setErrorTrending] = useState('')
  const [errorTopRated, setErrorTopRated] = useState('')
  const [errorLatestReleases, setErrorLatestReleases] = useState('')
  const [errorUpcoming, setErrorUpcoming] = useState('')

  const loadTrending = useCallback(async () => {
    if (loadingTrending || !hasMoreTrending) return
    setLoadingTrending(true)
    try {
      const data = await movieService.getTrendingMovies()
      // Filter out duplicates
      setTrending(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMovies = data.filter(m => !existingIds.has(m.id))
        return [...prev, ...newMovies]
      })
      setHasMoreTrending(false)
      setTrendingPage(prev => prev + 1)
    } catch {
      setErrorTrending('Could not load trending movies.')
    } finally {
      setLoadingTrending(false)
    }
  }, [loadingTrending, hasMoreTrending])

  const loadTopRated = useCallback(async () => {
    if (loadingTopRated || !hasMoreTopRated) return
    setLoadingTopRated(true)
    try {
      const data = await movieService.getTopRatedMovies()
      // Filter out duplicates
      setTopRated(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMovies = data.filter(m => !existingIds.has(m.id))
        return [...prev, ...newMovies]
      })
      setHasMoreTopRated(false)
      setTopRatedPage(prev => prev + 1)
    } catch {
      setErrorTopRated('Could not load top rated movies.')
    } finally {
      setLoadingTopRated(false)
    }
  }, [loadingTopRated, hasMoreTopRated])

  const loadLatestReleases = useCallback(async () => {
    if (loadingLatestReleases || !hasMoreLatestReleases) return
    setLoadingLatestReleases(true)
    try {
      const data = await movieService.getLatestReleases()
      // Filter out duplicates
      setLatestReleases(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMovies = data.filter(m => !existingIds.has(m.id))
        return [...prev, ...newMovies]
      })
      setHasMoreLatestReleases(false)
      setLatestReleasesPage(prev => prev + 1)
    } catch {
      setErrorLatestReleases('Could not load latest releases.')
    } finally {
      setLoadingLatestReleases(false)
    }
  }, [loadingLatestReleases, hasMoreLatestReleases])

  const loadUpcoming = useCallback(async () => {
    if (loadingUpcoming || !hasMoreUpcoming) return
    setLoadingUpcoming(true)
    try {
      const data = await movieService.getUpcomingMovies()
      // Filter out duplicates
      setUpcoming(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMovies = data.filter(m => !existingIds.has(m.id))
        return [...prev, ...newMovies]
      })
      setHasMoreUpcoming(false)
      setUpcomingPage(prev => prev + 1)
    } catch {
      setErrorUpcoming('Could not load upcoming movies.')
    } finally {
      setLoadingUpcoming(false)
    }
  }, [loadingUpcoming, hasMoreUpcoming])

  useEffect(() => {
    loadTrending()
    loadTopRated()
    loadLatestReleases()
    loadUpcoming()
  }, [])

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className='relative -mx-6 md:-mx-10 -mt-6 px-6 md:px-10 pt-12 pb-10 mb-6 overflow-hidden'>
        {/* Animated Background */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute inset-0' style={{
            background: 'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(251, 191, 36,0.08) 0%, transparent 60%)',
          }} />
          <div className='absolute top-0 right-0 w-[700px] h-[700px] opacity-40' style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11,0.08) 0%, transparent 70%)',
          }} />
          <div className='absolute bottom-0 left-0 w-[500px] h-[500px] opacity-30' style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6,0.06) 0%, transparent 70%)',
          }} />
        </div>

        <div className='relative max-w-3xl'>
          {/* Main Heading */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6 whitespace-nowrap'
            style={{ letterSpacing: '-0.03em', color: '#e6edf3' }}>
            Your "<span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Absolute Cinema</span>" Lounge
          </h1>

          {/* Subtitle */}
          <p className='text-base sm:text-xl mb-8 leading-relaxed max-w-2xl' style={{ color: '#8b949e' }}>
            Discover, rate, and track movies. Build your watchlist, explore trending films, and never miss what's hot in cinema.
          </p>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-4'>
            <Link
              to='/search'
              className='group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl'
              style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0d1117' }}>
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
                borderColor: 'rgba(251, 191, 36,0.3)', 
                background: 'rgba(251, 191, 36,0.05)' 
              }}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-5 h-5 group-hover:scale-110 transition-transform'>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
              My Watchlist
            </Link>
          </div>

        </div>
      </div>

      <SectionGroup label="What's Hot" />
      <MovieSection
        title="Trending This Week"
        subtitle="Most-watched movies right now"
        movies={trending}
        loading={loadingTrending}
        error={errorTrending}
        onLoadMore={loadTrending}
        hasMore={hasMoreTrending}
      />

      <SectionGroup label="Critically Acclaimed" />
      <MovieSection
        title="Top Rated Recent Films"
        subtitle="Highest rated movies from 2024 onwards"
        movies={topRated}
        loading={loadingTopRated}
        error={errorTopRated}
        onLoadMore={loadTopRated}
        hasMore={hasMoreTopRated}
      />

      <SectionGroup label="New & Upcoming" />
      <MovieSection
        title="Latest Releases"
        subtitle="Recently released movies"
        movies={latestReleases}
        loading={loadingLatestReleases}
        error={errorLatestReleases}
        onLoadMore={loadLatestReleases}
        hasMore={hasMoreLatestReleases}
      />
      <MovieSection
        title="Coming Soon"
        subtitle="Upcoming releases to watch for"
        movies={upcoming}
        loading={loadingUpcoming}
        error={errorUpcoming}
        onLoadMore={loadUpcoming}
        hasMore={hasMoreUpcoming}
      />
    </MainLayout>
  )
}

export default Home

// Made with Bob
