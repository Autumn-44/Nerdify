import GenreBadge from './GenreBadge'

const formatCurrency = amount =>
  amount > 0
    ? `$${(amount / 1_000_000).toFixed(1)}M`
    : 'N/A'

const formatRuntime = mins => {
  if (!mins) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const formatLanguage = code => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code)
  } catch {
    return code?.toUpperCase() || 'N/A'
  }
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className='flex gap-2'>
      <span className='text-gray-400 w-36 flex-shrink-0'>{label}</span>
      <span className='text-white'>{value}</span>
    </div>
  )
}

function MovieInfo({ movie }) {
  return (
    <div className='space-y-5 flex-1'>
      <div>
        <h2 className='text-3xl font-bold'>{movie.title}</h2>
        {movie.tagline && (
          <p className='text-gray-400 italic mt-1'>{movie.tagline}</p>
        )}
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <span className='text-yellow-400 text-lg font-semibold'>
          ⭐ {movie.rating}
        </span>
        <span className='text-gray-400 text-sm'>
          ({movie.voteCount.toLocaleString()} votes)
        </span>
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

      {movie.genres.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {movie.genres.map(genre => (
            <GenreBadge key={genre} genre={genre} />
          ))}
        </div>
      )}

      {movie.overview && (
        <p className='text-gray-300 leading-relaxed'>{movie.overview}</p>
      )}

      <div className='space-y-2 text-sm border-t border-white/10 pt-4'>
        <InfoRow label='Release Date' value={movie.releaseDate} />
        <InfoRow label='Language' value={formatLanguage(movie.originalLanguage)} />
        <InfoRow label='Budget' value={formatCurrency(movie.budget)} />
        <InfoRow label='Revenue' value={formatCurrency(movie.revenue)} />
      </div>
    </div>
  )
}

export default MovieInfo
