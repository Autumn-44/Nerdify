import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'
import tvShowService from '../services/tvShowService'

function TVShowSection({ title, subtitle, icon, shows, loading, error, onLoadMore, hasMore }) {
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
  if (!shows.length && !loading) return null

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
      <MovieGrid movies={shows} />
      {loading && (
        <div className='flex justify-center py-8'>
          <Loader />
        </div>
      )}
      {hasMore && !loading && <div ref={observerTarget} className='h-20' />}
    </div>
  )
}

function TVShows() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [airingToday, setAiringToday] = useState([])
  const [onTheAir, setOnTheAir] = useState([])
  
  const [trendingPage, setTrendingPage] = useState(1)
  const [popularPage, setPopularPage] = useState(1)
  const [topRatedPage, setTopRatedPage] = useState(1)
  const [airingTodayPage, setAiringTodayPage] = useState(1)
  const [onTheAirPage, setOnTheAirPage] = useState(1)
  
  const [loadingTrending, setLoadingTrending] = useState(false)
  const [loadingPopular, setLoadingPopular] = useState(false)
  const [loadingTopRated, setLoadingTopRated] = useState(false)
  const [loadingAiringToday, setLoadingAiringToday] = useState(false)
  const [loadingOnTheAir, setLoadingOnTheAir] = useState(false)
  
  const [hasMoreTrending, setHasMoreTrending] = useState(true)
  const [hasMorePopular, setHasMorePopular] = useState(true)
  const [hasMoreTopRated, setHasMoreTopRated] = useState(true)
  const [hasMoreAiringToday, setHasMoreAiringToday] = useState(true)
  const [hasMoreOnTheAir, setHasMoreOnTheAir] = useState(true)
  
  const [errorTrending, setErrorTrending] = useState('')
  const [errorPopular, setErrorPopular] = useState('')
  const [errorTopRated, setErrorTopRated] = useState('')
  const [errorAiringToday, setErrorAiringToday] = useState('')
  const [errorOnTheAir, setErrorOnTheAir] = useState('')

  const loadTrending = useCallback(async () => {
    if (loadingTrending || !hasMoreTrending) return
    setLoadingTrending(true)
    try {
      const data = await tvShowService.getTrendingTVShows(trendingPage)
      // Filter out duplicates
      setTrending(prev => {
        const existingIds = new Set(prev.map(s => s.id))
        const newShows = data.results.filter(s => !existingIds.has(s.id))
        return [...prev, ...newShows]
      })
      setHasMoreTrending(data.page < data.totalPages)
      setTrendingPage(prev => prev + 1)
    } catch {
      setErrorTrending('Could not load trending shows.')
    } finally {
      setLoadingTrending(false)
    }
  }, [trendingPage, loadingTrending, hasMoreTrending])

  const loadPopular = useCallback(async () => {
    if (loadingPopular || !hasMorePopular) return
    setLoadingPopular(true)
    try {
      const data = await tvShowService.getPopularTVShows(popularPage)
      // Filter out duplicates
      setPopular(prev => {
        const existingIds = new Set(prev.map(s => s.id))
        const newShows = data.results.filter(s => !existingIds.has(s.id))
        return [...prev, ...newShows]
      })
      setHasMorePopular(data.page < data.totalPages)
      setPopularPage(prev => prev + 1)
    } catch {
      setErrorPopular('Could not load popular shows.')
    } finally {
      setLoadingPopular(false)
    }
  }, [popularPage, loadingPopular, hasMorePopular])

  const loadTopRated = useCallback(async () => {
    if (loadingTopRated || !hasMoreTopRated) return
    setLoadingTopRated(true)
    try {
      const data = await tvShowService.getTopRatedTVShows(topRatedPage)
      // Filter out duplicates
      setTopRated(prev => {
        const existingIds = new Set(prev.map(s => s.id))
        const newShows = data.results.filter(s => !existingIds.has(s.id))
        return [...prev, ...newShows]
      })
      setHasMoreTopRated(data.page < data.totalPages)
      setTopRatedPage(prev => prev + 1)
    } catch {
      setErrorTopRated('Could not load top rated shows.')
    } finally {
      setLoadingTopRated(false)
    }
  }, [topRatedPage, loadingTopRated, hasMoreTopRated])

  const loadAiringToday = useCallback(async () => {
    if (loadingAiringToday || !hasMoreAiringToday) return
    setLoadingAiringToday(true)
    try {
      const data = await tvShowService.getAiringTodayTVShows(airingTodayPage)
      // Filter out duplicates
      setAiringToday(prev => {
        const existingIds = new Set(prev.map(s => s.id))
        const newShows = data.results.filter(s => !existingIds.has(s.id))
        return [...prev, ...newShows]
      })
      setHasMoreAiringToday(data.page < data.totalPages)
      setAiringTodayPage(prev => prev + 1)
    } catch {
      setErrorAiringToday('Could not load airing today shows.')
    } finally {
      setLoadingAiringToday(false)
    }
  }, [airingTodayPage, loadingAiringToday, hasMoreAiringToday])

  const loadOnTheAir = useCallback(async () => {
    if (loadingOnTheAir || !hasMoreOnTheAir) return
    setLoadingOnTheAir(true)
    try {
      const data = await tvShowService.getOnTheAirTVShows(onTheAirPage)
      // Filter out duplicates
      setOnTheAir(prev => {
        const existingIds = new Set(prev.map(s => s.id))
        const newShows = data.results.filter(s => !existingIds.has(s.id))
        return [...prev, ...newShows]
      })
      setHasMoreOnTheAir(data.page < data.totalPages)
      setOnTheAirPage(prev => prev + 1)
    } catch {
      setErrorOnTheAir('Could not load on the air shows.')
    } finally {
      setLoadingOnTheAir(false)
    }
  }, [onTheAirPage, loadingOnTheAir, hasMoreOnTheAir])

  useEffect(() => {
    loadTrending()
    loadPopular()
    loadTopRated()
    loadAiringToday()
    loadOnTheAir()
  }, [])

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className='relative -mx-6 md:-mx-10 -mt-6 px-6 md:px-10 pt-20 pb-20 mb-16 overflow-hidden'>
        {/* Animated Background */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute inset-0' style={{
            background: 'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(168,85,247,0.08) 0%, transparent 60%)',
          }} />
          <div className='absolute top-0 right-0 w-[700px] h-[700px] opacity-40' style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
          }} />
          <div className='absolute bottom-0 left-0 w-[500px] h-[500px] opacity-30' style={{
            background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
          }} />
        </div>

        <div className='relative max-w-3xl'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-8 border backdrop-blur-sm'
            style={{ 
              color: '#a855f7', 
              background: 'rgba(168,85,247,0.1)', 
              borderColor: 'rgba(168,85,247,0.3)',
              boxShadow: '0 0 20px rgba(168,85,247,0.1)'
            }}>
            <span className='w-2 h-2 rounded-full bg-purple-400 animate-pulse' />
            Binge-Worthy Series & Shows
          </div>

          {/* Main Heading */}
          <h1 className='text-6xl md:text-7xl font-black leading-[1.05] mb-6'
            style={{ letterSpacing: '-0.04em', color: '#e6edf3' }}>
            TV Shows{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #22d3ee 50%, #4ade80 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Universe
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-xl mb-10 leading-relaxed max-w-2xl' style={{ color: '#8b949e' }}>
            Discover trending series, track episodes, and never miss your favorite shows. Your complete TV companion.
          </p>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-4'>
            <Link
              to='/search'
              className='group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl'
              style={{ background: 'linear-gradient(135deg, #a855f7 0%, #22d3ee 100%)', color: '#0d1117' }}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-5 h-5 group-hover:scale-110 transition-transform'>
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              Explore TV Shows
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
                borderColor: 'rgba(168,85,247,0.3)', 
                background: 'rgba(168,85,247,0.05)' 
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
              <div className='text-3xl font-black' style={{ color: '#a855f7' }}>1000+</div>
              <div className='text-sm' style={{ color: '#8b949e' }}>TV Shows</div>
            </div>
            <div>
              <div className='text-3xl font-black' style={{ color: '#22d3ee' }}>Daily</div>
              <div className='text-sm' style={{ color: '#8b949e' }}>Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* TV Show Sections with Infinite Scroll */}
      <TVShowSection
        title="Trending This Week"
        subtitle="Most-watched TV shows right now"
        icon="🔥"
        shows={trending}
        loading={loadingTrending}
        error={errorTrending}
        onLoadMore={loadTrending}
        hasMore={hasMoreTrending}
      />

      <TVShowSection
        title="Top Rated Series"
        subtitle="Highest rated shows from 2020 onwards"
        icon="⭐"
        shows={topRated}
        loading={loadingTopRated}
        error={errorTopRated}
        onLoadMore={loadTopRated}
        hasMore={hasMoreTopRated}
      />

      <TVShowSection
        title="Popular Right Now"
        subtitle="What everyone's binge-watching"
        icon="📺"
        shows={popular}
        loading={loadingPopular}
        error={errorPopular}
        onLoadMore={loadPopular}
        hasMore={hasMorePopular}
      />

      <TVShowSection
        title="Airing Today"
        subtitle="New episodes airing today"
        icon="🎪"
        shows={airingToday}
        loading={loadingAiringToday}
        error={errorAiringToday}
        onLoadMore={loadAiringToday}
        hasMore={hasMoreAiringToday}
      />

      <TVShowSection
        title="On The Air"
        subtitle="Currently airing series"
        icon="📡"
        shows={onTheAir}
        loading={loadingOnTheAir}
        error={errorOnTheAir}
        onLoadMore={loadOnTheAir}
        hasMore={hasMoreOnTheAir}
      />
    </MainLayout>
  )
}

export default TVShows

// Made with Bob