import { Link } from 'react-router-dom'
import useRatings from '../../hooks/useRatings'

function MovieCard({ movie }) {
  const { getRating } = useRatings()
  const userRating = getRating(String(movie.id))

  return (
    <Link to={`/movie/${movie.id}`} className='group block'>
      <div className='relative rounded-xl overflow-hidden bg-[#161b22] transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-black/60'>
        <div className='relative aspect-[2/3] overflow-hidden'>
          <img
            src={movie.poster}
            alt={movie.title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />

          <div
            className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'
<<<<<<< HEAD
            style={{
              background:
                'linear-gradient(to top, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.6) 50%, transparent 100%)',
            }}
          >
            <h2 className='font-bold text-sm leading-tight text-white mb-1 line-clamp-2'>
              {movie.title}
            </h2>
            <div className='flex items-center gap-2'>
              <span className='text-yellow-400 text-xs font-semibold'>
                &#9733; {movie.rating}/10
              </span>
              {userRating && (
                <span
                  className='text-xs font-bold px-2 py-0.5 rounded-full'
                  style={{
                    background: 'rgba(74,222,128,0.15)',
                    color: '#4ade80',
                  }}
                >
=======
            style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.6) 50%, transparent 100%)' }}
          >
            <h2 className='font-bold text-sm leading-tight text-white mb-1 line-clamp-2'>{movie.title}</h2>
            <div className='flex items-center gap-2'>
              <span className='text-yellow-400 text-xs font-semibold'>★ {movie.rating}</span>
              {userRating && (
                <span className='text-xs font-bold px-2 py-0.5 rounded-full' style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
                  You: {userRating}/10
                </span>
              )}
            </div>
            <div className='mt-3'>
<<<<<<< HEAD
              <span
                className='text-xs font-semibold px-3 py-1.5 rounded-lg'
                style={{ background: '#4ade80', color: '#0d1117' }}
              >
                View Details
=======
              <span className='text-xs font-semibold px-3 py-1.5 rounded-lg' style={{ background: '#4ade80', color: '#0d1117' }}>
                View Details →
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
              </span>
            </div>
          </div>
        </div>

        {userRating && (
          <div className='absolute top-2 left-2'>
<<<<<<< HEAD
            <span
              className='text-xs font-bold px-2 py-1 rounded-full shadow-lg'
              style={{ background: '#4ade80', color: '#0d1117' }}
            >
              &#9733; {userRating}/10
=======
            <span className='text-xs font-bold px-2 py-1 rounded-full shadow-lg' style={{ background: '#4ade80', color: '#0d1117' }}>
              ★ {userRating}
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
            </span>
          </div>
        )}

        <div className='p-3 group-hover:opacity-0 transition-opacity duration-200'>
<<<<<<< HEAD
          <h2
            className='font-semibold text-sm truncate'
            style={{ color: '#e6edf3' }}
          >
            {movie.title}
          </h2>
          <p className='text-xs mt-0.5' style={{ color: '#8b949e' }}>
            &#9733; {movie.rating}/10
          </p>
=======
          <h2 className='font-semibold text-sm truncate' style={{ color: '#e6edf3' }}>{movie.title}</h2>
          <p className='text-xs mt-0.5' style={{ color: '#8b949e' }}>★ {movie.rating}</p>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
