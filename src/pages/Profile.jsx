import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'
import { getWatchlist } from '../utils/watchlistStorage'
import { getDiaryEntries } from '../utils/diaryStorage'
import useRatings from '../hooks/useRatings'

function Profile() {
  const { user } = useContext(AuthContext)
  const { ratings } = useRatings()
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [stats, setStats] = useState({
    watchlist: 0,
    diary: 0,
    ratings: 0
  })

  useEffect(() => {
    // Load user data from localStorage
    const savedBio = localStorage.getItem('user_bio') || 'Film enthusiast and cinephile 🎬'
    const savedName = localStorage.getItem('user_display_name') || user?.displayName || user?.email?.split('@')[0] || 'User'
    setBio(savedBio)
    setDisplayName(savedName)

    // Calculate stats
    const watchlistCount = getWatchlist().length
    const diaryCount = getDiaryEntries().length
    const ratingsCount = Object.keys(ratings).length

    setStats({
      watchlist: watchlistCount,
      diary: diaryCount,
      ratings: ratingsCount
    })
  }, [user, ratings])

  const handleSaveBio = () => {
    localStorage.setItem('user_bio', bio)
    setIsEditingBio(false)
  }

  const handleSaveName = () => {
    localStorage.setItem('user_display_name', displayName)
    setIsEditingName(false)
  }

  const handleCancelBio = () => {
    const savedBio = localStorage.getItem('user_bio') || 'Film enthusiast and cinephile 🎬'
    setBio(savedBio)
    setIsEditingBio(false)
  }

  const handleCancelName = () => {
    const savedName = localStorage.getItem('user_display_name') || user?.displayName || user?.email?.split('@')[0] || 'User'
    setDisplayName(savedName)
    setIsEditingName(false)
  }

  return (
    <MainLayout>
      <div className='max-w-4xl mx-auto'>
        {/* Profile Header */}
        <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-8 border border-white/10 mb-8'>
          <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
            {/* Avatar */}
            <div className='relative'>
              <div className='w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-5xl font-bold text-white shadow-xl'>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className='absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#1a1f2e]'></div>
            </div>

            {/* User Info */}
            <div className='flex-1 w-full'>
              {/* Display Name */}
              {isEditingName ? (
                <div className='mb-4'>
                  <input
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-2xl font-bold text-white focus:border-orange-400/50 focus:ring-1 focus:ring-orange-400/20 outline-none'
                    placeholder='Your display name'
                    autoFocus
                  />
                  <div className='flex gap-2 mt-2'>
                    <button
                      onClick={handleSaveName}
                      className='px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors'>
                      Save
                    </button>
                    <button
                      onClick={handleCancelName}
                      className='px-4 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-semibold rounded-lg transition-colors'>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex items-center gap-3 mb-2'>
                  <h1 className='text-3xl font-bold text-white'>{displayName}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className='text-gray-400 hover:text-orange-400 transition-colors'>
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                    </svg>
                  </button>
                </div>
              )}

              <p className='text-gray-400 text-sm mb-4'>{user?.email}</p>

              {/* Bio */}
              {isEditingBio ? (
                <div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-300 focus:border-orange-400/50 focus:ring-1 focus:ring-orange-400/20 outline-none resize-none'
                    rows={3}
                    placeholder='Tell us about yourself...'
                    autoFocus
                  />
                  <div className='flex gap-2 mt-2'>
                    <button
                      onClick={handleSaveBio}
                      className='px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors'>
                      Save Bio
                    </button>
                    <button
                      onClick={handleCancelBio}
                      className='px-4 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-semibold rounded-lg transition-colors'>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex items-start gap-2'>
                  <p className='text-gray-300 flex-1'>{bio}</p>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className='text-gray-400 hover:text-orange-400 transition-colors flex-shrink-0'>
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <Link to='/watchlist' className='bg-[#1c1f26] rounded-xl p-6 border border-white/10 hover:border-green-400/30 transition-all group'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-400 text-sm font-semibold uppercase tracking-wider'>Watchlist</span>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5 text-green-400'>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
            </div>
            <p className='text-4xl font-black text-white group-hover:text-green-400 transition-colors'>{stats.watchlist}</p>
            <p className='text-gray-500 text-sm mt-1'>films to watch</p>
          </Link>

          <Link to='/diary' className='bg-[#1c1f26] rounded-xl p-6 border border-white/10 hover:border-orange-400/30 transition-all group'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-400 text-sm font-semibold uppercase tracking-wider'>Diary</span>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5 text-orange-400'>
                <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
                <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
              </svg>
            </div>
            <p className='text-4xl font-black text-white group-hover:text-orange-400 transition-colors'>{stats.diary}</p>
            <p className='text-gray-500 text-sm mt-1'>films logged</p>
          </Link>

          <div className='bg-[#1c1f26] rounded-xl p-6 border border-white/10'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-400 text-sm font-semibold uppercase tracking-wider'>Ratings</span>
              <svg viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5 text-yellow-400'>
                <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
              </svg>
            </div>
            <p className='text-4xl font-black text-white'>{stats.ratings}</p>
            <p className='text-gray-500 text-sm mt-1'>films rated</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-[#1c1f26] rounded-xl p-6 border border-white/10'>
          <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <Link
              to='/search'
              className='flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all group'>
              <div className='w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/30 transition-colors'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.35-4.35' />
                </svg>
              </div>
              <div>
                <p className='font-semibold text-white'>Find Movies</p>
                <p className='text-xs text-gray-400'>Discover new films</p>
              </div>
            </Link>

            <Link
              to='/settings'
              className='flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all group'>
              <div className='w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/30 transition-colors'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                  <circle cx='12' cy='12' r='3' />
                  <path d='M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2' />
                </svg>
              </div>
              <div>
                <p className='font-semibold text-white'>Settings</p>
                <p className='text-xs text-gray-400'>Manage your account</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Profile

// Made with Bob
