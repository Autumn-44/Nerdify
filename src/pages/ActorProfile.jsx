import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import MovieGrid from '../components/movie/MovieGrid'
import Loader from '../components/common/Loader'
import movieService from '../services/movieService'

function ActorProfile() {
  const { id } = useParams()
  const [actor, setActor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isBioExpanded, setIsBioExpanded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')

    movieService
      .getActorDetails(id)
      .then(data => {
        setActor(data)
      })
      .catch(() => setError('Could not load actor details.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    )
  }

  if (error || !actor) {
    return (
      <MainLayout>
        <p className='text-red-400 text-center py-20'>
          {error || 'Actor not found.'}
        </p>
      </MainLayout>
    )
  }

  const age = actor.birthday 
    ? Math.floor((new Date() - new Date(actor.birthday)) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  return (
    <MainLayout>
      {/* Actor Header */}
      <div className='relative mb-12'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1117]/50 to-[#0d1117]' />
        
        <div className='max-w-6xl mx-auto px-4 py-12'>
          <div className='flex flex-col md:flex-row gap-8 items-start'>
            {/* Profile Image */}
            <div className='flex-shrink-0'>
              {actor.profileImage ? (
                <img
                  src={actor.profileImage}
                  alt={actor.name}
                  className='w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-2xl ring-4 ring-white/10'
                />
              ) : (
                <div className='w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-white/10 flex items-center justify-center shadow-2xl ring-4 ring-white/10'>
                  <span className='text-8xl text-gray-400'>👤</span>
                </div>
              )}
            </div>

            {/* Actor Info */}
            <div className='flex-1'>
              <h1 className='text-4xl md:text-5xl font-black mb-4 text-white'>
                {actor.name}
              </h1>

              {actor.knownFor && (
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-400/10 border border-orange-400/30 mb-4'>
                  <span className='text-orange-400 font-semibold text-sm'>
                    {actor.knownFor}
                  </span>
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                {actor.birthday && (
                  <div className='flex items-center gap-3 text-gray-300'>
                    <span className='text-2xl'>🎂</span>
                    <div>
                      <div className='text-sm text-gray-500'>Born</div>
                      <div className='font-semibold'>
                        {new Date(actor.birthday).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {age && ` (${age} years old)`}
                      </div>
                    </div>
                  </div>
                )}

                {actor.placeOfBirth && (
                  <div className='flex items-center gap-3 text-gray-300'>
                    <span className='text-2xl'>📍</span>
                    <div>
                      <div className='text-sm text-gray-500'>Place of Birth</div>
                      <div className='font-semibold'>{actor.placeOfBirth}</div>
                    </div>
                  </div>
                )}
              </div>

              {actor.biography && (
                <div className='bg-white/5 rounded-xl p-5 border border-white/10'>
                  <h3 className='text-lg font-bold mb-3 text-white flex items-center gap-2'>
                    <span>📖</span>
                    Biography
                  </h3>
                  <div className={`overflow-hidden transition-all duration-300 ${!isBioExpanded ? 'max-h-32' : 'max-h-none'}`}>
                    <p className='text-gray-300 leading-relaxed text-sm whitespace-pre-line'>
                      {actor.biography}
                    </p>
                  </div>
                  {actor.biography.length > 400 && (
                    <button
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                      className='mt-3 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors flex items-center gap-1'>
                      {isBioExpanded ? 'Show less' : 'Read more'}
                      <svg
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        className={`w-4 h-4 transition-transform ${isBioExpanded ? 'rotate-180' : ''}`}>
                        <polyline points='6 9 12 15 18 9' />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className='max-w-6xl mx-auto px-4 pb-12'>
        <div className='flex items-center gap-4 mb-6'>
          <div>
            <h2 className='text-2xl font-black flex items-center gap-2 text-white'>
              <span className='text-3xl'>🎬</span>
              Movies & TV Shows
            </h2>
            <p className='text-sm mt-1 text-gray-400'>
              {actor.movies.length} {actor.movies.length === 1 ? 'title' : 'titles'} found
            </p>
          </div>
          <div className='flex-1 h-px bg-gradient-to-r from-orange-400/20 to-transparent' />
        </div>

        {actor.movies.length > 0 ? (
          <MovieGrid movies={actor.movies} />
        ) : (
          <div className='text-center py-20'>
            <p className='text-5xl mb-4'>🎭</p>
            <h3 className='text-xl font-bold mb-2 text-white'>No movies found</h3>
            <p className='text-gray-400'>
              No movie credits available for this actor
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default ActorProfile

// Made with Bob
