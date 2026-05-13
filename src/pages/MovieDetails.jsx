import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CastCard from '../components/movie/CastCard'
import Loader from '../components/common/Loader'
import MainLayout from '../layouts/MainLayout'
import MovieBanner from '../components/movie/MovieBanner'
import MovieInfo from '../components/movie/MovieInfo'
import MovieTrailer from '../components/movie/MovieTrailer'
import SimilarMovies from '../components/movie/SimilarMovies'
import StarRating from '../components/movie/StarRating'
import movieService from '../services/movieService'
import useRatings from '../hooks/useRatings'
import {
  addToWatchlist,
  isInWatchlist,
  removeFromWatchlist,
} from '../utils/watchlistStorage'

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [watchlisted, setWatchlisted] = useState(false)
  const { getRating, rate, unrate } = useRatings()

  useEffect(() => {
    setLoading(true)
    setError('')

    movieService
      .getMovieDetails(id)
      .then(data => {
        setMovie(data)
        setWatchlisted(isInWatchlist(data.id))
      })
      .catch(() => setError('Could not load movie details.'))
      .finally(() => setLoading(false))
  }, [id])

  const toggleWatchlist = () => {
    if (!movie) return

    if (watchlisted) {
      removeFromWatchlist(movie.id)
      setWatchlisted(false)
    } else {
      addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
      })
      setWatchlisted(true)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    )
  }

  if (error || !movie) {
    return (
      <MainLayout>
        <p className='text-red-400 text-center py-20'>
          {error || 'Movie not found.'}
        </p>
      </MainLayout>
    )
  }

  const userRating = getRating(String(movie.id))

  return (
    <MainLayout>
      <MovieBanner
        backdrop={movie.backdrop}
        title={movie.title}
        tagline={movie.tagline}
      />

      <div className='max-w-6xl mx-auto mt-8 px-4 space-y-12'>
        <div className='flex flex-col md:flex-row gap-8'>
          <div className='flex-shrink-0 flex flex-col gap-3'>
            <img
              src={movie.poster}
              alt={movie.title}
              className='w-full md:w-56 rounded-xl object-cover shadow-lg'
            />
            <button
              onClick={toggleWatchlist}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                watchlisted
                  ? 'bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/30'
              }`}
            >
              {watchlisted
                ? 'Saved to Watchlist'
                : 'Add to Watchlist'}
            </button>
          </div>

          <div className='flex-1 space-y-6'>
            <MovieInfo movie={movie} />

            <div className='border-t border-white/10 pt-5'>
              <p className='text-sm text-gray-400 uppercase tracking-widest mb-3 font-semibold'>
                Your Rating
              </p>
              <StarRating
                movieId={String(movie.id)}
                currentRating={userRating}
                onRate={rate}
                onUnrate={unrate}
              />
            </div>
          </div>
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
