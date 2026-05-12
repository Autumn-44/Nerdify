import { useState } from 'react'

const STARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function Star({ filled }) {
  return (
    <svg viewBox='0 0 24 24' className='w-6 h-6' fill='currentColor'>
      <path
        className={filled ? 'text-green-400' : 'text-gray-600'}
        fill='currentColor'
        d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
      />
    </svg>
  )
}

function StarRating({ movieId, currentRating, onRate, onUnrate }) {
  const [hovered, setHovered] = useState(null)

  const displayValue = hovered ?? currentRating ?? 0

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
              onMouseEnter={() => setHovered(star)}
              onClick={() => {
                if (currentRating === star) {
                  onUnrate(movieId)
                } else {
                  onRate(movieId, star)
                }
              }}
            >
              <Star filled={star <= displayValue} />
            </span>
          ))}
        </div>

        {currentRating && (
          <span className='ml-2 text-green-400 font-bold text-lg'>
            {currentRating}/10
          </span>
        )}
      </div>

      <p className='text-gray-400 text-sm'>
        {hovered
          ? `Rate: ${hovered}/10`
          : currentRating
          ? 'Your rating · click to change or re-click to remove'
          : 'Click a star to rate out of 10'}
      </p>
    </div>
  )
}

export default StarRating
