import { useState } from 'react'

const STARS = [1, 2, 3, 4, 5]

function Star({ fill }) {
  if (fill === 'full') {
    return (
      <svg viewBox='0 0 24 24' className='w-7 h-7 text-green-400' fill='currentColor'>
        <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
      </svg>
    )
  }
  if (fill === 'half') {
    return (
      <svg viewBox='0 0 24 24' className='w-7 h-7' fill='currentColor'>
        <defs>
          <linearGradient id='half-grad'>
            <stop offset='50%' stopColor='#4ade80' />
            <stop offset='50%' stopColor='#4b5563' />
          </linearGradient>
        </defs>
        <path
          fill='url(#half-grad)'
          d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
        />
      </svg>
    )
  }
  return (
    <svg viewBox='0 0 24 24' className='w-7 h-7 text-gray-600' fill='currentColor'>
      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
    </svg>
  )
}

function getFill(starIndex, value) {
  if (value >= starIndex) return 'full'
  if (value >= starIndex - 0.5) return 'half'
  return 'empty'
}

function StarRating({ movieId, currentRating, onRate, onUnrate }) {
  const [hovered, setHovered] = useState(null)

  const displayValue = hovered ?? currentRating ?? 0

  const handleMouseMove = (e, star) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const half = x < rect.width / 2
    setHovered(half ? star - 0.5 : star)
  }

  const handleClick = (e, star) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const half = x < rect.width / 2
    const value = half ? star - 0.5 : star

    if (currentRating === value) {
      onUnrate(movieId)
    } else {
      onRate(movieId, value)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-1'>
        <div
          className='flex gap-0.5 cursor-pointer'
          onMouseLeave={() => setHovered(null)}
        >
          {STARS.map(star => (
            <span
              key={star}
              onMouseMove={e => handleMouseMove(e, star)}
              onClick={e => handleClick(e, star)}
            >
              <Star fill={getFill(star, displayValue)} />
            </span>
          ))}
        </div>

        {currentRating && (
          <span className='ml-2 text-green-400 font-semibold text-lg'>
            {currentRating}
          </span>
        )}
      </div>

      <p className='text-gray-400 text-sm'>
        {hovered
          ? `Rate: ${hovered} star${hovered !== 1 ? 's' : ''}`
          : currentRating
          ? `Your rating · click to change or re-click to remove`
          : 'Click a star to rate'}
      </p>
    </div>
  )
}

export default StarRating
