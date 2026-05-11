function ReviewCard({ review }) {
  return (
    <div className='bg-[#1c1f26] p-5 rounded-lg'>
      <h3 className='font-bold'>{review.username}</h3>

      <p className='text-yellow-400'>⭐ {review.rating}</p>

      <p className='text-gray-300 mt-3'>
        {review.text}
      </p>
    </div>
  )
}

export default ReviewCard