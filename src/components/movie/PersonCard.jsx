import { Link } from 'react-router-dom'

function PersonCard({ person }) {
  return (
    <Link
      to={`/actor/${person.id}`}
      className='group block bg-[#1c1f26] rounded-lg overflow-hidden hover:ring-2 hover:ring-green-400/50 transition-all duration-300'
    >
      <div className='aspect-[2/3] bg-gray-800 relative overflow-hidden'>
        {person.profileImage ? (
          <img
            src={person.profileImage}
            alt={person.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800'>
            <svg
              className='w-20 h-20 text-gray-600'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
            </svg>
          </div>
        )}
        
        {/* Known For Badge */}
        <div className='absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white'>
          {person.knownFor}
        </div>
      </div>

      <div className='p-3'>
        <h3 className='font-semibold text-white group-hover:text-green-400 transition-colors line-clamp-1'>
          {person.name}
        </h3>
        
        {person.knownForMovies && (
          <p className='text-xs text-gray-400 mt-1 line-clamp-2'>
            Known for: {person.knownForMovies}
          </p>
        )}
      </div>
    </Link>
  )
}

export default PersonCard

// Made with Bob