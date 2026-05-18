import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className='sticky top-0 z-50 backdrop-blur-xl border-b' 
      style={{ 
        background: 'rgba(13, 17, 23, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
      }}>
      <div className='max-w-7xl mx-auto px-6 md:px-10 py-4'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-3 group'>
            <img 
              src='/logo.png' 
              alt='Nerdify Logo' 
              className='w-12 h-12 transition-transform duration-300 group-hover:scale-110'
            />
            <span className='text-2xl font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent'>
              Nerdify
            </span>
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center gap-2'>
            <Link 
              to='/' 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-400 border border-orange-400/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                <polyline points='9 22 9 12 15 12 15 22' />
              </svg>
              Home
            </Link>

            <Link 
              to='/search' 
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                isActive('/search') 
                  ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-400 border border-orange-400/30' 
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
                  ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-400 border border-orange-400/30' 
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
                  ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-400 border border-orange-400/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
              </svg>
              Watchlist
            </Link>

            <div className='w-px h-6 bg-white/10 mx-2' />

            {user ? (
              <>
                <div className='flex items-center gap-2 px-3 py-2 rounded-lg' 
                  style={{ background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.2)' }}>
                  <div className='w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm'
                    style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className='text-sm font-semibold text-orange-400'>
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className='px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/30'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                    <polyline points='16 17 21 12 16 7' />
                    <line x1='21' y1='12' x2='9' y2='12' />
                  </svg>
                  Logout
                </button>
              </>
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
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
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
