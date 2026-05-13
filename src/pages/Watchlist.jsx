<<<<<<< HEAD
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import useRatings from '../hooks/useRatings'
import {
  getWatchlist,
  removeFromWatchlist,
} from '../utils/watchlistStorage'
=======
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { getWatchlist, removeFromWatchlist } from '../utils/watchlistStorage'
import useRatings from '../hooks/useRatings'
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2

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
<<<<<<< HEAD
        <p className='text-gray-500 text-sm mt-0.5'>
          {movie.releaseDate?.slice(0, 4)}
        </p>

        <div className='flex items-center gap-3 mt-2'>
          <span className='text-yellow-400 text-sm'>
            &#9733; {movie.rating}/10
          </span>
=======
        <p className='text-gray-500 text-sm mt-0.5'>{movie.releaseDate?.slice(0, 4)}</p>

        <div className='flex items-center gap-3 mt-2'>
          <span className='text-yellow-400 text-sm'>⭐ {movie.rating}</span>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
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
<<<<<<< HEAD
        x
=======
        ✕
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
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
<<<<<<< HEAD
    setList(prev => prev.filter(movie => movie.id !== id))
=======
    setList(prev => prev.filter(m => m.id !== id))
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
  }

  return (
    <MainLayout>
      <div className='max-w-2xl mx-auto'>
<<<<<<< HEAD
        <div className='mb-8'>
          <h1 className='text-3xl font-black'>My Watchlist</h1>
          <p className='text-gray-500 text-sm mt-1'>
            {list.length} {list.length === 1 ? 'film' : 'films'} saved
          </p>
=======
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-black'>My Watchlist</h1>
            <p className='text-gray-500 text-sm mt-1'>
              {list.length} {list.length === 1 ? 'film' : 'films'} saved
            </p>
          </div>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
        </div>

        {list.length === 0 ? (
          <div className='text-center py-24'>
<<<<<<< HEAD
            <h2 className='text-xl font-bold mb-2'>Nothing saved yet</h2>
            <p className='text-gray-500 mb-6'>
              Add films from their detail pages to track what you want
              to watch.
            </p>
=======
            <p className='text-5xl mb-4'>🎬</p>
            <h2 className='text-xl font-bold mb-2'>Nothing saved yet</h2>
            <p className='text-gray-500 mb-6'>Add films from their detail pages to track what you want to watch.</p>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
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
<<<<<<< HEAD
              <WatchlistCard
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
              />
=======
              <WatchlistCard key={movie.id} movie={movie} onRemove={handleRemove} />
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Watchlist
