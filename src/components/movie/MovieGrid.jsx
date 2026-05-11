import MovieCard from './MovieCard'

function MovieGrid({ movies }) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5'>
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieGrid