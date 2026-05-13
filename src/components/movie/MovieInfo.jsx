import GenreBadge from './GenreBadge'
<<<<<<< HEAD
import RatingStars from './RatingStars'
=======
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2

const formatCurrency = amount =>
  amount > 0
    ? `$${(amount / 1_000_000).toFixed(1)}M`
    : 'N/A'

const formatRuntime = mins => {
  if (!mins) return null
<<<<<<< HEAD
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
=======
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
}

const formatLanguage = code => {
  try {
<<<<<<< HEAD
    return new Intl.DisplayNames(['en'], {
      type: 'language',
    }).of(code)
=======
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code)
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
  } catch {
    return code?.toUpperCase() || 'N/A'
  }
}

function InfoRow({ label, value }) {
  if (!value) return null
<<<<<<< HEAD

  return (
    <div className='flex gap-2'>
      <span className='text-gray-400 w-36 flex-shrink-0'>
        {label}
      </span>
=======
  return (
    <div className='flex gap-2'>
      <span className='text-gray-400 w-36 flex-shrink-0'>{label}</span>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
      <span className='text-white'>{value}</span>
    </div>
  )
}

function MovieInfo({ movie }) {
<<<<<<< HEAD
  const genres = Array.isArray(movie.genres) ? movie.genres : []

=======
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
  return (
    <div className='space-y-5 flex-1'>
      <div>
        <h2 className='text-3xl font-bold'>{movie.title}</h2>
        {movie.tagline && (
<<<<<<< HEAD
          <p className='text-gray-400 italic mt-1'>
            {movie.tagline}
          </p>
=======
          <p className='text-gray-400 italic mt-1'>{movie.tagline}</p>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
        )}
      </div>

      <div className='flex flex-wrap items-center gap-3'>
<<<<<<< HEAD
        <RatingStars rating={movie.rating} />
        {movie.voteCount > 0 && (
          <span className='text-gray-400 text-sm'>
            ({movie.voteCount.toLocaleString()} votes)
          </span>
        )}
=======
        <span className='text-yellow-400 text-lg font-semibold'>
          ⭐ {movie.rating}
        </span>
        <span className='text-gray-400 text-sm'>
          ({movie.voteCount.toLocaleString()} votes)
        </span>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
        {formatRuntime(movie.runtime) && (
          <span className='text-gray-300 text-sm bg-white/10 px-2 py-0.5 rounded'>
            {formatRuntime(movie.runtime)}
          </span>
        )}
        {movie.status && (
          <span className='text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded'>
            {movie.status}
          </span>
        )}
      </div>

<<<<<<< HEAD
      {genres.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {genres.map(genre => (
=======
      {movie.genres.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {movie.genres.map(genre => (
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
            <GenreBadge key={genre} genre={genre} />
          ))}
        </div>
      )}

      {movie.overview && (
<<<<<<< HEAD
        <p className='text-gray-300 leading-relaxed'>
          {movie.overview}
        </p>
=======
        <p className='text-gray-300 leading-relaxed'>{movie.overview}</p>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
      )}

      <div className='space-y-2 text-sm border-t border-white/10 pt-4'>
        <InfoRow label='Release Date' value={movie.releaseDate} />
<<<<<<< HEAD
        <InfoRow
          label='Language'
          value={formatLanguage(movie.originalLanguage)}
        />
=======
        <InfoRow label='Language' value={formatLanguage(movie.originalLanguage)} />
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
        <InfoRow label='Budget' value={formatCurrency(movie.budget)} />
        <InfoRow label='Revenue' value={formatCurrency(movie.revenue)} />
      </div>
    </div>
  )
}

export default MovieInfo
