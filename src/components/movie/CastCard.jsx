function CastCard({ actor }) {
  return (
    <div className='text-center'>
      <img
        src={actor.image}
        alt={actor.name}
        className='w-24 h-24 rounded-full object-cover mx-auto'
      />

      <p className='mt-2'>{actor.name}</p>
    </div>
  )
}

export default CastCard