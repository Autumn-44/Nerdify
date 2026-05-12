import { useState, useEffect, useRef } from 'react'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/common/Loader'
import movieService from '../services/movieService'

function Search() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setMovies([])
      setSearched(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const results = await movieService.searchMovies(query.trim())
        setMovies(results)
        setSearched(true)
      } catch {
        setError('Could not search movies right now.')
      } finally {
        setIsLoading(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  return (
    <MainLayout>
      <div className='max-w-3xl mx-auto pt-8 pb-4'>
        <h1 className='text-4xl font-black text-center mb-2'>Find Your Next Watch</h1>
        <p className='text-gray-400 text-center mb-8'>Search any movie title and dive in</p>

        <div className='relative'>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none'
          >
            <circle cx='11' cy='11' r='8' />
            <line x1='21' y1='21' x2='16.65' y2='16.65' />
          </svg>

          <input
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='e.g. Interstellar, The Godfather...'
            autoFocus
            className='w-full bg-[#1c1f26] border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white text-lg placeholder-gray-600 outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all'
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors'
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className='mt-8'>
        {isLoading && <Loader />}

        {error && <p className='text-red-400 text-center'>{error}</p>}

        {!isLoading && searched && movies.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-5xl mb-4'>🎬</p>
            <p className='text-gray-400 text-lg'>No results for "<span className='text-white'>{query}</span>"</p>
            <p className='text-gray-600 text-sm mt-1'>Try a different title</p>
          </div>
        )}

        {!isLoading && !searched && !query && (
          <div className='text-center py-20'>
            <p className='text-5xl mb-4'>🍿</p>
            <p className='text-gray-500'>Start typing to search millions of films</p>
          </div>
        )}

        {!isLoading && movies.length > 0 && (
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <p className='text-gray-400 text-sm'>
                <span className='text-white font-semibold'>{movies.length}</span> results for "{query}"
              </p>
              <div className='flex-1 h-px bg-white/5' />
            </div>
            <MovieGrid movies={movies} />
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Search
