import { Link } from 'react-router-dom'
import useRatings from '../../hooks/useRatings'

function MovieCard({ movie }) {
  const { getRating } = useRatings()
  const userRating = getRating(String(movie.id))

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className='bg-[#1c1f26] rounded-lg overflow-hidden hover:scale-105 transition relative'>
        <img
          src={movie.poster}
          alt={movie.title}
          className='w-full h-[320px] object-cover'
        />

        {userRating && (
          <div className='absolute top-2 right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow'>
            ★ {userRating}
          </div>
        )}

        <div className='p-3'>
          <h2 className='font-semibold truncate'>{movie.title}</h2>
          <p className='text-gray-400 text-sm'>⭐ {movie.rating}</p>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
