function MovieInfo({ movie }) {
  return (
    <div className='space-y-3'>
      <h2 className='text-3xl font-bold'>{movie.title}</h2>

      <p className='text-gray-300'>{movie.description}</p>

      <p>⭐ {movie.rating}</p>

      <p>{movie.releaseDate}</p>
    </div>
  )
}

export default MovieInfo