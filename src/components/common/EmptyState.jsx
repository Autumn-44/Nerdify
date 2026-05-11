function EmptyState({ message }) {
  return (
    <div className='flex justify-center items-center py-20'>
      <p className='text-gray-400 text-lg'>
        {message || 'No data found'}
      </p>
    </div>
  )
}

export default EmptyState