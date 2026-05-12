import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import MovieBanner from '../components/movie/MovieBanner'
import MovieInfo from '../components/movie/MovieInfo'
import MovieTrailer from '../components/movie/MovieTrailer'
import CastCard from '../components/movie/CastCard'
import SimilarMovies from '../components/movie/SimilarMovies'
import Loader from '../components/common/Loader'
import movieService from '../services/movieService'

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    movieService
      .getMovieDetails(id)
      .then(data => setMovie(data))
      .catch(() => setError('Could not load movie details.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <MainLayout><Loader /></MainLayout>

  if (error) return (
    <MainLayout>
      <p className='text-red-400 text-center py-20'>{error}</p>
    </MainLayout>
  )

  return (
    <MainLayout>
      <MovieBanner backdrop={movie.backdrop} title={movie.title} tagline={movie.tagline} />

      <div className='max-w-6xl mx-auto mt-8 px-4 space-y-12'>
        <div className='flex flex-col md:flex-row gap-8'>
          <img
            src={movie.poster}
            alt={movie.title}
            className='w-full md:w-64 rounded-xl object-cover shadow-lg flex-shrink-0'
          />
          <MovieInfo movie={movie} />
        </div>

        {movie.trailerKey && (
          <section>
            <h2 className='text-2xl font-bold mb-4'>Trailer</h2>
            <MovieTrailer
              trailerUrl={`https://www.youtube.com/embed/${movie.trailerKey}`}
              title={movie.title}
            />
          </section>
        )}

        {movie.cast.length > 0 && (
          <section>
            <h2 className='text-2xl font-bold mb-4'>Cast</h2>
            <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4'>
              {movie.cast.map(actor => (
                <CastCard key={actor.id} actor={actor} />
              ))}
            </div>
          </section>
        )}

        {movie.similar.length > 0 && (
          <SimilarMovies movies={movie.similar} />
        )}
      </div>
    </MainLayout>
  )
}

export default MovieDetails
