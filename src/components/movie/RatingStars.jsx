function RatingStars({ rating }) {
  return (
    <div className='flex gap-1 text-yellow-400'>
      {'⭐'.repeat(rating)}
    </div>
  )
}

export default RatingStars