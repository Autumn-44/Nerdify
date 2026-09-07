import { Link } from 'react-router-dom'
import useRatings from '../../hooks/useRatings'

function MovieCard({ movie }) {
  const { getRating } = useRatings()
  const userRating = getRating(String(movie.id))
  const isTV = movie.mediaType === 'tv'
  const linkPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`

  return (
    <Link to={linkPath} className='group block'>
      {/* Card: fixed aspect ratio, no extra bottom section */}
      <div className='relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-xl group-hover:shadow-black/60 group-hover:border-yellow-400/30'>

        {/* Poster image */}
        <img
          src={movie.poster}
          alt={movie.title}
          className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
        />

        {/* Always-visible bottom label (fades out on hover) */}
        <div className='absolute inset-x-0 bottom-0 px-3 py-2 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none'
          style={{ background: 'linear-gradient(to top, rgba(10,15,26,0.92) 0%, transparent 100%)' }}>
          <h2 className='font-semibold text-xs leading-tight text-white truncate'>
            {movie.title}
          </h2>
          <div className='flex items-center justify-between mt-0.5'>
            <span className='text-[11px] flex items-center gap-1 text-yellow-400 font-medium'>
              <svg viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
              {movie.rating}
            </span>
            {movie.releaseDate && (
              <span className='text-[11px] text-white/50'>{movie.releaseDate.slice(0, 4)}</span>
            )}
          </div>
        </div>

        {/* Hover overlay — full cover with info */}
        <div
          className='absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          style={{ background: 'linear-gradient(to top, rgba(10,15,26,0.97) 0%, rgba(10,15,26,0.55) 55%, transparent 100%)' }}
        >
          <h2 className='font-bold text-sm leading-snug text-white mb-2 line-clamp-2'>
            {movie.title}
          </h2>

          <div className='flex items-center gap-2 mb-3'>
            <span className='flex items-center gap-1 text-yellow-400 text-xs font-semibold'>
              <svg viewBox='0 0 24 24' fill='currentColor' className='w-3.5 h-3.5'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
              {movie.rating}
            </span>
            {userRating && (
              <span className='text-[11px] font-bold px-2 py-0.5 rounded-full'
                style={{ background: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                You: {userRating}/10
              </span>
            )}
          </div>

          <span className='self-start text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5'
            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#0f172a' }}>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-3.5 h-3.5'>
              <circle cx='12' cy='12' r='10' />
              <polygon points='10 8 16 12 10 16 10 8' />
            </svg>
            View Details
          </span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard

// Made with Bob
