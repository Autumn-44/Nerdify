import MovieGrid from './MovieGrid'

function SimilarMovies({ movies }) {
  return (
    <div className='mt-10'>
      <h2 className='text-2xl font-bold mb-5'>
        Similar Movies
      </h2>

      <MovieGrid movies={movies} />
    </div>
  )
}

export default SimilarMovies