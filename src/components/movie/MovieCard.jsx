import { Link } from 'react-router-dom'
import useRatings from '../../hooks/useRatings'

function MovieCard({ movie }) {
  const { getRating } = useRatings()
  const userRating = getRating(String(movie.id))
  const isTV = movie.mediaType === 'tv'
  const linkPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`

  return (
    <Link to={linkPath} className='group block'>
      <div className='relative rounded-2xl overflow-hidden bg-gradient-to-br from-dark-850 to-dark-900 transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-primary-500/20 border border-white/5 group-hover:border-primary-400/30'>
        <div className='relative aspect-[2/3] overflow-hidden'>
          <img
            src={movie.poster}
            alt={movie.title}
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
          />

          {/* Gradient Overlay on Hover */}
          <div
            className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'
            style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.7) 50%, transparent 100%)' }}
          >
            <h2 className='font-bold text-sm leading-tight text-white mb-2 line-clamp-2'>
              {movie.title}
            </h2>
            <div className='flex items-center gap-2 mb-3'>
              <span className='text-yellow-400 text-xs font-semibold flex items-center gap-1'>
                <svg viewBox='0 0 24 24' fill='currentColor' className='w-3.5 h-3.5'>
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
                {movie.rating}
              </span>
              {userRating && (
                <span className='text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm'
                  style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                  You: {userRating}/10
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5'
                style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-3.5 h-3.5'>
                  <circle cx='12' cy='12' r='10' />
                  <polygon points='10 8 16 12 10 16 10 8' />
                </svg>
                View Details
              </span>
            </div>
          </div>

          {/* Shimmer Effect */}
          <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
            <div className='absolute inset-0 animate-shimmer' />
          </div>
        </div>


        {/* Bottom Info (Always Visible) */}
        <div className='p-3 group-hover:opacity-0 transition-opacity duration-200'>
          <h2 className='font-bold text-sm truncate mb-1' style={{ color: '#f8fafc' }}>
            {movie.title}
          </h2>
          <div className='flex items-center justify-between'>
            <span className='text-xs flex items-center gap-1' style={{ color: '#8b949e' }}>
              <svg viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3 text-yellow-400'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
              {movie.rating}
            </span>
            {movie.releaseDate && (
              <span className='text-xs' style={{ color: '#8b949e' }}>
                {movie.releaseDate.slice(0, 4)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard

// Made with Bob
