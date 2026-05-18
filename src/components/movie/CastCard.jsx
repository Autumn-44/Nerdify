import { Link } from 'react-router-dom'

function CastCard({ actor }) {
  return (
    <Link to={`/actor/${actor.id}`} className='text-center group'>
      {actor.image ? (
        <img
          src={actor.image}
          alt={actor.name}
          className='w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-white/10 group-hover:ring-orange-400/50 transition-all duration-200'
        />
      ) : (
        <div className='w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto ring-2 ring-white/10 group-hover:ring-orange-400/50 transition-all duration-200'>
          <span className='text-2xl text-gray-400'>👤</span>
        </div>
      )}
      <p className='mt-2 text-sm font-semibold truncate group-hover:text-orange-400 transition-colors'>
        {actor.name}
      </p>
      {actor.character && (
        <p className='text-xs text-gray-400 truncate'>{actor.character}</p>
      )}
    </Link>
  )
}

export default CastCard
