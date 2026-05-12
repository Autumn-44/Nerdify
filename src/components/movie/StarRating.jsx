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
  if (value <= 8.5) return '#4ade80'
  return '#22d3ee'
}

function StarRating({ movieId, currentRating, onRate, onUnrate }) {
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

  return (
    <div className='flex flex-col gap-3 w-full max-w-sm'>
      <div className='flex items-end gap-3'>
        <span
          className='text-5xl font-black leading-none tabular-nums transition-colors duration-150'
          style={{ color }}
        >
          {displayValue !== null ? displayValue.toFixed(1) : '—'}
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

      <div className='relative w-full'>
        <input
          type='range'
          min='0.5'
          max='10'
          step='0.5'
          value={dragging ?? currentRating ?? 0.5}
          onChange={handleChange}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          className='w-full h-2 rounded-full appearance-none cursor-pointer'
          style={{
            background: displayValue
              ? `linear-gradient(to right, ${color} ${((displayValue - 0.5) / 9.5) * 100}%, #374151 ${((displayValue - 0.5) / 9.5) * 100}%)`
              : '#374151',
          }}
        />
      </div>

      <div className='flex justify-between text-xs text-gray-500 px-0.5'>
        <span>0.5</span>
        <span>5</span>
        <span>10</span>
      </div>

      <p className='text-gray-500 text-xs'>
        {currentRating && !dragging
          ? 'Drag to change · click the score to remove your rating'
          : dragging
          ? 'Release to save'
          : 'Drag the slider to rate'}
      </p>

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
