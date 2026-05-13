import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import movieService from '../services/movieService'
import MovieGrid from '../components/movie/MovieGrid'

function Search() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])

  const handleSearch = async e => {
    e.preventDefault()

    if (!query) return

    const data = await movieService.searchMovies(query)

    setMovies(data)
  }

  return (
    <MainLayout>
      <div>
        <h1 className='text-4xl font-bold mb-8'>
          Search Movies
        </h1>

        <form
          onSubmit={handleSearch}
          className='mb-8'
        >
          <input
            type='text'
            placeholder='Search for movies...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            className='bg-[#1c1f26] text-white px-4 py-3 rounded-lg w-full outline-none'
          />
        </form>

        <MovieGrid movies={movies} />
      </div>
    </MainLayout>
  )
}

export default Search
