function CastCard({ actor }) {
  return (
    <div className='text-center'>
      {actor.image ? (
        <img
          src={actor.image}
          alt={actor.name}
          className='w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-white/10'
        />
      ) : (
        <div className='w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto ring-2 ring-white/10'>
<<<<<<< HEAD
          <span className='text-2xl text-gray-400'>?</span>
=======
          <span className='text-2xl text-gray-400'>👤</span>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
        </div>
      )}
      <p className='mt-2 text-sm font-semibold truncate'>{actor.name}</p>
      {actor.character && (
<<<<<<< HEAD
        <p className='text-xs text-gray-400 truncate'>
          {actor.character}
        </p>
=======
        <p className='text-xs text-gray-400 truncate'>{actor.character}</p>
>>>>>>> 9bf4a6b4c277b7a15bff312bb61cc5f8a6d9f7d2
      )}
    </div>
  )
}

export default CastCard
