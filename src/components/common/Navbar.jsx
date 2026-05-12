import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/profile', label: 'Profile' },
]

function Navbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <nav
      className='sticky top-0 z-50 border-b'
      style={{
        background: 'rgba(13,17,23,0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className='max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8'>
        <Link to='/' className='flex items-center gap-3 flex-shrink-0 group'>
          <img src='/logo.png' alt='Nerdify' className='h-9 w-auto' />
          <span
            className='text-lg font-black tracking-tight hidden sm:block transition-opacity group-hover:opacity-80'
            style={{ color: '#e6edf3', letterSpacing: '-0.02em' }}
          >
            Nerdify
          </span>
        </Link>

        <div className='flex items-center gap-1 flex-1 justify-center'>
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className='relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150'
                style={{
                  color: active ? '#4ade80' : '#8b949e',
                  background: active ? 'rgba(74,222,128,0.08)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.color = '#e6edf3'
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.color = '#8b949e'
                }}
              >
                {label}
                {active && (
                  <span
                    className='absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full'
                    style={{ background: '#4ade80' }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <Link
          to={user ? '/profile' : '/login'}
          className='flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-150'
          style={{ background: '#4ade80', color: '#0d1117' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#86efac')}
          onMouseLeave={e => (e.currentTarget.style.background = '#4ade80')}
        >
          {user ? user.name || 'Account' : 'Sign In'}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
