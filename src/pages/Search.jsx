import { useState } from 'react'
import MovieGrid from '../components/movie/MovieGrid'
import MainLayout from '../layouts/MainLayout'
import movieService from '../services/movieService'

function Search() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setMovies([])
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const results = await movieService.searchMovies(trimmedQuery)
      setMovies(results)
    } catch (error) {
      setError('Could not search movies right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className='space-y-6'>
        <h1 className='text-4xl font-bold'>
          Search Movies
        </h1>

        <form
          onSubmit={handleSubmit}
          className='flex max-w-2xl gap-3'
        >
          <input
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Search by movie title'
            className='min-w-0 flex-1 rounded-md bg-[#1c1f26] px-4 py-3 text-white outline-none ring-1 ring-white/10 focus:ring-[#00e054]'
          />

          <button
            type='submit'
            disabled={isLoading}
            className='rounded-md bg-[#00e054] px-5 py-3 font-semibold text-[#14181c] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading ? 'Searching' : 'Search'}
          </button>
        </form>

        {error && (
          <p className='text-red-400'>{error}</p>
        )}

        <MovieGrid movies={movies} />
      </div>
    </MainLayout>
  )
}

export default Search
