function RatingStars({ rating, label = 'TMDB' }) {
  return (
    <div className='flex items-center gap-2 text-sm'>
      <span className='text-yellow-400'>&#9733;</span>
      <span className='text-gray-300'>
        {label}: {rating}/10
      </span>
    </div>
  )
}

export default RatingStars
