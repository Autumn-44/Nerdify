import { useState } from 'react'

const LABELS = {
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

function StarRating({ movieId, currentRating, onRate, onUnrate, isUpcoming = false, releaseDate = null }) {
  const [dragging, setDragging] = useState(null)

  const displayValue = dragging ?? currentRating ?? null
  const color = displayValue ? getRatingColor(displayValue) : '#6b7280'

  const handleChange = e => {
    setDragging(parseFloat(e.target.value))
  }

  const handleCommit = e => {
    const value = parseFloat(e.target.value)
    setDragging(null)
    if (currentRating === value) {
      onUnrate(movieId)
    } else {
      onRate(movieId, value)
    }
  }

  // Check if movie is upcoming (release date is in the future)
  if (isUpcoming) {
    return (
      <div className='flex flex-col gap-4 w-full max-w-sm'>
        <div className='bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-400/30 rounded-xl p-6 text-center'>
          <div className='text-4xl mb-3'>⏳</div>
          <h3 className='text-xl font-bold text-blue-400 mb-2'>Waiting for Release</h3>
          <p className='text-sm text-gray-400 mb-3'>
            This movie hasn't been released yet
          </p>
          {releaseDate && (
            <div className='inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg text-sm font-semibold'>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
                <line x1='16' y1='2' x2='16' y2='6' />
                <line x1='8' y1='2' x2='8' y2='6' />
                <line x1='3' y1='10' x2='21' y2='10' />
              </svg>
              Releases: {new Date(releaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
        <p className='text-xs text-gray-500 text-center'>
          You'll be able to rate this movie after it's released
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3 w-full max-w-sm'>
      <div className='flex items-end gap-3'>
        <span
          className='text-5xl font-black leading-none tabular-nums transition-colors duration-150'
          style={{ color }}
        >
          {displayValue !== null ? displayValue.toFixed(1) : '--'}
        </span>
        <span className='text-gray-500 text-lg mb-1'>/10</span>
        {displayValue && LABELS[displayValue] && (
          <span
            className='text-sm font-semibold mb-1.5 transition-colors duration-150'
            style={{ color }}
          >
            {LABELS[displayValue]}
          </span>
        )}
      </div>

      <input
        type='range'
        min='0.5'
        max='10'
        step='0.5'
        value={dragging ?? currentRating ?? 0.5}
        onChange={event => setDragging(parseFloat(event.target.value))}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        className='w-full h-2 rounded-full appearance-none cursor-pointer'
        style={{
          background: displayValue
            ? `linear-gradient(to right, ${color} ${
                ((displayValue - 0.5) / 9.5) * 100
              }%, #374151 ${
                ((displayValue - 0.5) / 9.5) * 100
              }%)`
            : '#374151',
        }}
      />

      <div className='flex justify-between text-xs text-gray-500 px-0.5'>
        <span>0.5</span>
        <span>5</span>
        <span>10</span>
      </div>

      {currentRating && !dragging && (
        <button
          onClick={() => onUnrate(movieId)}
          className='text-xs text-gray-500 hover:text-red-400 transition w-fit underline underline-offset-2'
        >
          Remove rating
        </button>
      )}
    </div>
  )
}

export default StarRating
