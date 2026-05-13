import MovieGrid from './MovieGrid'

function SimilarMovies({ movies }) {
  return (
    <section className='mt-4 pb-10'>
      <h2 className='text-2xl font-bold mb-5'>Similar Movies</h2>
      <MovieGrid movies={movies} />
    </section>
  )
}

export default SimilarMovies
