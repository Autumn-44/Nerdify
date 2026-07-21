import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CastCard from '../components/movie/CastCard'
import Loader from '../components/common/Loader'
import DatePicker from '../components/common/DatePicker'
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
import { addDiaryEntry } from '../utils/diaryStorage'

const RATING_LABELS = {
  0.5: 'Why was this even made?',
  1: 'Unwatchable',
  1.5: 'Terrible',
  2: 'Very Bad',
  2.5: 'Bad',
  3: 'Poor',
  3.5: 'Below Average',
  4: 'Mediocre',
  4.5: 'Okay',
  5: 'Mid',
  5.5: 'Fine',
  6: 'Decent',
  6.5: 'Good',
  7: 'Very Good',
  7.5: 'Great',
  8: 'Excellent',
  8.5: 'Brilliant',
  9: 'Unbelievable',
  9.5: 'Absolute Cinema',
  10: 'Masterpiece',
}

function getRatingColor(value) {
  if (value <= 3) return '#ef4444'
  if (value <= 5) return '#f97316'
  if (value <= 7) return '#eab308'
  if (value <= 8.5) return '#fbbf24'
  return '#f59e0b'
}

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [watchlisted, setWatchlisted] = useState(false)
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split('T')[0])
  const [diaryRating, setDiaryRating] = useState(null)
  const [draggingRating, setDraggingRating] = useState(null)
  const [publicReview, setPublicReview] = useState('')
  const [privateNote, setPrivateNote] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { getRating, rate, unrate } = useRatings()
  
  const showNotification = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

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
      showNotification('Removed from watchlist')
    } else {
      const added = addToWatchlist({
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
      })
      if (added) {
        setWatchlisted(true)
        showNotification('Added to watchlist! 🎬')
      }
    }
  }

  const handleAddToDiary = () => {
    if (!movie) return
    
    addDiaryEntry(
      {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        rating: movie.rating,
        releaseDate: movie.releaseDate,
      },
      diaryDate,
      diaryRating,
      publicReview,
      privateNote
    )
    
    setShowDiaryModal(false)
    setDiaryRating(null)
    setDraggingRating(null)
    setPublicReview('')
    setPrivateNote('')
    showNotification('Successfully logged to diary! 📔')
  }

  const handleRatingChange = (e) => {
    setDraggingRating(parseFloat(e.target.value))
  }

  const handleRatingCommit = (e) => {
    const value = parseFloat(e.target.value)
    setDiaryRating(value)
    setDraggingRating(null)
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
  const displayRating = draggingRating ?? diaryRating
  const ratingColor = displayRating ? getRatingColor(displayRating) : '#6b7280'

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
              onClick={() => setShowDiaryModal(true)}
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-400 border border-orange-400/30 hover:from-orange-400/30 hover:to-orange-500/30'>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
                <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
              </svg>
              Log to Diary
            </button>
            
            <button
              onClick={toggleWatchlist}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                watchlisted
                  ? 'bg-primary-400/10 text-primary-400 border border-primary-400/30 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-primary-400/10 hover:text-primary-400 hover:border-primary-400/30'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
              {watchlisted ? 'Saved to Watchlist' : 'Add to Watchlist'}
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

      {/* Diary Modal */}
      {showDiaryModal && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setShowDiaryModal(false)}>
          <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-2xl font-black text-white flex items-center gap-2'>
                <span className='text-3xl'>📔</span>
                Log to Diary
              </h3>
              <button
                onClick={() => setShowDiaryModal(false)}
                className='text-gray-400 hover:text-white transition-colors'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-6 h-6'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>

            <div className='space-y-5'>
              {/* Date */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-2'>
                  📅 When did you watch it?
                </label>
                <DatePicker
                  value={diaryDate}
                  onChange={setDiaryDate}
                  maxDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Slider Rating */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-3'>
                  ⭐ Your Rating (Optional)
                </label>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-end gap-3 mb-3'>
                    <span
                      className='text-4xl font-black leading-none tabular-nums transition-colors duration-150'
                      style={{ color: ratingColor }}>
                      {displayRating !== null ? displayRating.toFixed(1) : '--'}
                    </span>
                    <span className='text-gray-500 text-lg mb-1'>/10</span>
                    {displayRating && RATING_LABELS[displayRating] && (
                      <span
                        className='text-sm font-semibold mb-1.5 transition-colors duration-150'
                        style={{ color: ratingColor }}>
                        {RATING_LABELS[displayRating]}
                      </span>
                    )}
                  </div>

                  <input
                    type='range'
                    min='0.5'
                    max='10'
                    step='0.5'
                    value={draggingRating ?? diaryRating ?? 0.5}
                    onChange={handleRatingChange}
                    onMouseUp={handleRatingCommit}
                    onTouchEnd={handleRatingCommit}
                    className='w-full h-2 rounded-full appearance-none cursor-pointer'
                    style={{
                      background: displayRating
                        ? `linear-gradient(to right, ${ratingColor} ${
                            ((displayRating - 0.5) / 9.5) * 100
                          }%, #374151 ${
                            ((displayRating - 0.5) / 9.5) * 100
                          }%)`
                        : '#374151',
                    }}
                  />

                  <div className='flex justify-between text-xs text-gray-500 px-0.5 mt-2'>
                    <span>0.5</span>
                    <span>5</span>
                    <span>10</span>
                  </div>

                  {diaryRating && !draggingRating && (
                    <button
                      onClick={() => {
                        setDiaryRating(null)
                        setDraggingRating(null)
                      }}
                      className='text-xs text-gray-500 hover:text-red-400 transition w-fit underline underline-offset-2 mt-2'>
                      Clear rating
                    </button>
                  )}
                </div>
              </div>

              {/* Public Review */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                    <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                  Public Review (Optional)
                  <span className='text-xs text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded-full'>Visible to everyone</span>
                </label>
                <textarea
                  value={publicReview}
                  onChange={e => setPublicReview(e.target.value)}
                  placeholder='Share your thoughts with the community...'
                  rows={3}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-primary-400/50 focus:ring-1 focus:ring-primary-400/20 outline-none transition-all resize-none'
                />
              </div>

              {/* Private Note */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                    <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                  </svg>
                  Private Note (Optional)
                  <span className='text-xs text-accent-400 bg-accent-400/10 px-2 py-0.5 rounded-full'>Only you can see</span>
                </label>
                <textarea
                  value={privateNote}
                  onChange={e => setPrivateNote(e.target.value)}
                  placeholder='Personal notes, reminders, or thoughts...'
                  rows={3}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-accent-400/50 focus:ring-1 focus:ring-accent-400/20 outline-none transition-all resize-none'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-2'>
                <button
                  onClick={() => setShowDiaryModal(false)}
                  className='flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all'>
                  Cancel
                </button>
                <button
                  onClick={handleAddToDiary}
                  className='flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all'
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
                  Add to Diary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className='fixed bottom-8 right-8 z-50 animate-slide-up'>
          <div className='bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-primary-400/30'>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-6 h-6 flex-shrink-0'>
              <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
              <polyline points='22 4 12 14.01 9 11.01' />
            </svg>
            <span className='font-semibold'>{toastMessage}</span>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default MovieDetails

// Made with Bob
