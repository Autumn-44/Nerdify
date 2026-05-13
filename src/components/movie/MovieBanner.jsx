function MovieBanner({ backdrop, title, tagline }) {
  return (
    <div
      className='w-full h-[420px] bg-cover bg-center relative flex items-end'
      style={{ backgroundImage: backdrop ? `url(${backdrop})` : 'none' }}
    >
      <div className='absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/60 to-transparent' />
      <div className='relative z-10 p-8'>
        <h1 className='text-4xl md:text-5xl font-bold drop-shadow'>
          {title}
        </h1>
        {tagline && (
          <p className='mt-2 text-gray-300 italic text-lg'>
            {tagline}
          </p>
        )}
      </div>
    </div>
  )
}

export default MovieBanner
