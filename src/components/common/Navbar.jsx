import { Link, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

function Navbar() {
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className='sticky top-0 z-50 backdrop-blur-xl border-b'
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        borderColor: 'rgba(251, 191, 36, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
      }}>
      <div className='max-w-7xl mx-auto px-6 md:px-10 py-4'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-3 group'>
            <div className='relative h-12 w-12 rounded-2xl shadow-lg shadow-primary-500/20 transition-all duration-300 group-hover:shadow-primary-400/30 group-hover:scale-105 overflow-hidden'>
              <img
                src='/logo.png'
                alt='Nerdify logo'
                className='h-full w-full object-cover'
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-2xl font-black bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent'>
                Nerdify
              </span>
              <span className='text-[10px] font-semibold text-gray-500 -mt-1 tracking-wider'>
                CINEMA HUB
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center gap-6'>
            <Link 
              to='/' 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                <polyline points='9 22 9 12 15 12 15 22' />
              </svg>
              Movies
            </Link>

            <Link
              to='/tv-shows'
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/tv-shows')
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <rect x='2' y='7' width='20' height='15' rx='2' ry='2' />
                <polyline points='17 2 12 7 7 2' />
              </svg>
              TV Shows
            </Link>

            <Link
              to='/search'
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/search')
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <circle cx='11' cy='11' r='8' />
                <line x1='21' y1='21' x2='16.65' y2='16.65' />
              </svg>
              Search
            </Link>

            <Link 
              to='/diary' 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/diary')
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
                <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
              </svg>
              Diary
            </Link>

            <Link 
              to='/watchlist' 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/watchlist')
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
              Watchlist
            </Link>

            <Link
              to='/quiz'
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/quiz')
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <circle cx='12' cy='12' r='10' />
                <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
                <line x1='12' y1='17' x2='12.01' y2='17' />
              </svg>
              Quiz
            </Link>

            <div className='w-px h-6 bg-white/10 mx-2' />

            {user ? (
              <div className='relative'>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200'
                >
                  <div className='w-8 h-8 rounded-full overflow-hidden border-2 border-primary-500/30 hover:border-primary-500/50 transition-all duration-200'>
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center font-bold text-sm'
                        style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}>
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  >
                    <polyline points='6 9 12 15 18 9' />
                  </svg>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className='fixed inset-0 z-10'
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className='absolute right-0 mt-2 w-56 bg-[#1c1f26] rounded-lg shadow-xl border border-white/10 py-2 z-20'>
                      <div className='px-4 py-3 border-b border-white/10'>
                        <p className='text-sm font-semibold text-white truncate'>
                          {user.displayName || 'User'}
                        </p>
                        <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                      </div>
                      
                      <Link
                        to='/profile'
                        onClick={() => setShowUserMenu(false)}
                        className='flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors'
                      >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                          <circle cx='12' cy='7' r='4' />
                        </svg>
                        Profile
                      </Link>

                      <Link
                        to='/settings'
                        onClick={() => setShowUserMenu(false)}
                        className='flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors'
                      >
                        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                          <circle cx='12' cy='12' r='3' />
                          <path d='M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2 2l-4.2 4.2M23 12h-6m-6 0H5m13.2 5.2l-4.2-4.2m-2-2l-4.2-4.2' />
                        </svg>
                        Settings
                      </Link>

                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to='/login' 
                  className='px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5'>
                  Login
                </Link>

                <Link 
                  to='/register' 
                  className='px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 flex items-center gap-2'
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}>
                  Get Started
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' className='w-4 h-4'>
                    <line x1='5' y1='12' x2='19' y2='12' />
                    <polyline points='12 5 19 12 12 19' />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

// Made with Bob
