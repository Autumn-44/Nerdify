import { Link, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'

const NAV_LINKS = [
  {
    to: '/',
    label: 'Movies',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
        <polyline points='9 22 9 12 15 12 15 22' />
      </svg>
    ),
  },
  {
    to: '/tv-shows',
    label: 'TV Shows',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <rect x='2' y='7' width='20' height='15' rx='2' ry='2' />
        <polyline points='17 2 12 7 7 2' />
      </svg>
    ),
  },
  {
    to: '/search',
    label: 'Search',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <circle cx='11' cy='11' r='8' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
      </svg>
    ),
  },
  {
    to: '/diary',
    label: 'Diary',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20' />
        <path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' />
      </svg>
    ),
  },
  {
    to: '/watchlist',
    label: 'Watchlist',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <path d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z' />
      </svg>
    ),
  },
  {
    to: '/quiz',
    label: 'Quiz',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <circle cx='12' cy='12' r='10' />
        <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
        <line x1='12' y1='17' x2='12.01' y2='17' />
      </svg>
    ),
  },
]

function Navbar() {
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    setMobileOpen(false)
    setShowUserMenu(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className='sticky top-0 z-50 backdrop-blur-xl border-b'
        style={{
          background: 'rgba(15, 23, 42, 0.92)',
          borderColor: 'rgba(251, 191, 36, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className='max-w-7xl mx-auto px-4 md:px-10 py-3'>
          <div className='flex justify-between items-center'>

            {/* Logo */}
            <Link to='/' className='flex items-center gap-2.5 group flex-shrink-0'>
              <div className='flex-shrink-0 h-10 w-10 rounded-full overflow-hidden ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105'>
                <img src='/logo.png' alt='Nerdify logo' className='h-full w-full object-cover object-center' />
              </div>
              <div className='flex flex-col'>
                <span className='text-xl font-black bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent'>
                  Nerdify
                </span>
                <span className='text-[9px] font-semibold text-gray-500 -mt-0.5 tracking-wider hidden sm:block'>
                  A MOVIE A DAY IS PRODUCTIVITY
                </span>
              </div>
            </Link>

            {/* Desktop nav — hidden on mobile */}
            <div className='hidden md:flex items-center gap-1'>
              {NAV_LINKS.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive(to)
                      ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              ))}

              <div className='w-px h-6 bg-white/10 mx-1' />

              {user ? (
                <div className='relative'>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200'
                  >
                    <div className='w-8 h-8 rounded-full overflow-hidden border-2 border-primary-500/30'>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt='Profile' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center font-bold text-sm'
                          style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}>
                          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>
                      <polyline points='6 9 12 15 18 9' />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <>
                      <div className='fixed inset-0 z-10' onClick={() => setShowUserMenu(false)} />
                      <div className='absolute right-0 mt-2 w-56 bg-[#1c1f26] rounded-lg shadow-xl border border-white/10 py-2 z-20'>
                        <div className='px-4 py-3 border-b border-white/10'>
                          <p className='text-sm font-semibold text-white truncate'>{user.displayName || 'User'}</p>
                          <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                        </div>
                        <Link to='/profile' onClick={() => setShowUserMenu(false)}
                          className='flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors'>
                          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                            <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                            <circle cx='12' cy='7' r='4' />
                          </svg>
                          Profile
                        </Link>
                        <Link to='/settings' onClick={() => setShowUserMenu(false)}
                          className='flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors'>
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
                  <Link to='/login'
                    className='px-4 py-2 rounded-lg font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200'>
                    Login
                  </Link>
                  <Link to='/register'
                    className='px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all duration-200'
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

            {/* Mobile: avatar + hamburger */}
            <div className='flex md:hidden items-center gap-2'>
              {user && (
                <div className='w-8 h-8 rounded-full overflow-hidden border-2 border-primary-500/30 flex-shrink-0'>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt='Profile' className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center font-bold text-sm'
                      style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}>
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setMobileOpen(true)}
                className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all'
                aria-label='Open menu'
              >
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-6 h-6'>
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]' onClick={() => setMobileOpen(false)} />
          <div className='fixed top-0 left-0 h-full w-72 z-[70] flex flex-col animate-slide-in-left'
            style={{ background: '#0d1117', borderRight: '1px solid rgba(251,191,36,0.12)' }}>

            <div className='flex items-center justify-between px-5 py-4 border-b'
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <Link to='/' className='flex items-center gap-2.5'>
                <div className='flex-shrink-0 h-9 w-9 rounded-full overflow-hidden ring-1 ring-white/10'>
                  <img src='/logo.png' alt='Nerdify logo' className='h-full w-full object-cover object-center' />
                </div>
                <span className='text-lg font-black bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent'>
                  Nerdify
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)}
                className='p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all'
                aria-label='Close menu'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>

            <nav className='flex-1 overflow-y-auto px-3 py-4 space-y-1'>
              {NAV_LINKS.map(({ to, label, icon }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 border border-primary-400/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>

            <div className='px-3 py-4 border-t space-y-2' style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {user ? (
                <>
                  <div className='flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5'>
                    <div className='w-9 h-9 rounded-full overflow-hidden border-2 border-primary-500/30 flex-shrink-0'>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt='Profile' className='w-full h-full object-cover' />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center font-bold text-sm'
                          style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}>
                          {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-white truncate'>{user.displayName || 'User'}</p>
                      <p className='text-xs text-gray-400 truncate'>{user.email}</p>
                    </div>
                  </div>
                  <Link to='/profile'
                    className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium'>
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                      <circle cx='12' cy='7' r='4' />
                    </svg>
                    Profile
                  </Link>
                  <Link to='/settings'
                    className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium'>
                    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                      <circle cx='12' cy='12' r='3' />
                      <path d='M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m-2 2l-4.2 4.2M23 12h-6m-6 0H5m13.2 5.2l-4.2-4.2m-2-2l-4.2-4.2' />
                    </svg>
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link to='/login'
                    className='flex items-center justify-center w-full px-4 py-3 rounded-xl font-semibold text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition-all'>
                    Login
                  </Link>
                  <Link to='/register'
                    className='flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all'
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
        </>
      )}
    </>
  )
}

export default Navbar

// Made with Bob
