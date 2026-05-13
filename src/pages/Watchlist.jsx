import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import useRatings from '../hooks/useRatings'
import {
  getWatchlist,
  removeFromWatchlist,
} from '../utils/watchlistStorage'

function WatchlistCard({ movie, onRemove }) {
  const { getRating } = useRatings()
  const userRating = getRating(String(movie.id))

  return (
    <div className='group flex gap-4 bg-[#1c1f26] rounded-xl p-4 hover:bg-[#22262e] transition-colors'>
      <Link to={`/movie/${movie.id}`} className='flex-shrink-0'>
        <img
          src={movie.poster}
          alt={movie.title}
          className='w-16 h-24 object-cover rounded-lg'
        />
      </Link>

      <div className='flex-1 min-w-0'>
        <Link to={`/movie/${movie.id}`}>
          <h3 className='font-bold text-lg hover:text-green-400 transition-colors truncate'>
            {movie.title}
          </h3>
        </Link>
        <p className='text-gray-500 text-sm mt-0.5'>
          {movie.releaseDate?.slice(0, 4)}
        </p>

        <div className='flex items-center gap-3 mt-2'>
          <span className='text-yellow-400 text-sm'>
            &#9733; {movie.rating}/10
          </span>
          {userRating && (
            <span className='text-green-400 text-sm font-semibold'>
              Your rating: {userRating}/10
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(movie.id)}
        className='opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all self-start mt-1 text-lg'
        title='Remove from watchlist'
      >
        x
      </button>
    </div>
  )
}

function Watchlist() {
  const [list, setList] = useState([])

  useEffect(() => {
    setList(getWatchlist())
  }, [])

  const handleRemove = id => {
    removeFromWatchlist(id)
    setList(prev => prev.filter(movie => movie.id !== id))
  }

  return (
    <MainLayout>
      <div className='max-w-2xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-black'>My Watchlist</h1>
          <p className='text-gray-500 text-sm mt-1'>
            {list.length} {list.length === 1 ? 'film' : 'films'} saved
          </p>
        </div>

        {list.length === 0 ? (
          <div className='text-center py-24'>
            <h2 className='text-xl font-bold mb-2'>Nothing saved yet</h2>
            <p className='text-gray-500 mb-6'>
              Add films from their detail pages to track what you want
              to watch.
            </p>
            <Link
              to='/search'
              className='inline-flex px-5 py-2.5 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors'
            >
              Find something to watch
            </Link>
          </div>
        ) : (
          <div className='space-y-3'>
            {list.map(movie => (
              <WatchlistCard
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Watchlist
