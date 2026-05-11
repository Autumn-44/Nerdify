import MovieGrid from '../movie/MovieGrid'

function FavoriteMovies({ movies }) {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-5'>
        Favorite Movies
      </h2>

      <MovieGrid movies={movies} />
    </div>
  )
}

export default FavoriteMovies