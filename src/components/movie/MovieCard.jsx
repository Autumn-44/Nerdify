import { Link } from 'react-router-dom'

function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className='bg-[#1c1f26] rounded-lg overflow-hidden hover:scale-105 transition'>
        <img
          src={movie.poster}
          alt={movie.title}
          className='w-full h-[320px] object-cover'
        />

        <div className='p-3'>
          <h2 className='font-semibold'>{movie.title}</h2>
          <p className='text-gray-400'>⭐ {movie.rating}</p>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard