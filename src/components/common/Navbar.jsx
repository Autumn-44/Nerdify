import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const NAV_LINKS = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
        <polyline points='9 22 9 12 15 12 15 22' />
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
    to: '/watchlist',
    label: 'Watchlist',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <path d='M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
        <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
        <circle cx='12' cy='7' r='4' />
      </svg>
    ),
  },
]

function Navbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()

  return (
    <nav className='sticky top-0 z-50 backdrop-blur-md bg-[#14181c]/80 border-b border-white/5'>
      <div className='max-w-7xl mx-auto px-6 py-3 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 group'>
          <div className='w-8 h-8 rounded-lg bg-green-400 flex items-center justify-center'>
            <span className='text-black font-black text-sm'>N</span>
          </div>
          <span className='text-xl font-black tracking-tight text-white group-hover:text-green-400 transition-colors'>
            Nerdify
          </span>
        </Link>

        <div className='flex items-center gap-1'>
          {NAV_LINKS.map(({ to, label, icon }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-green-400/10 text-green-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {icon}
                {label}
                {active && (
                  <span className='w-1 h-1 rounded-full bg-green-400 ml-0.5' />
                )}
              </Link>
            )
          })}

          <div className='w-px h-5 bg-white/10 mx-2' />

          <Link
            to={user ? '/profile' : '/login'}
            className='px-4 py-2 rounded-lg bg-green-400 text-black text-sm font-bold hover:bg-green-300 transition-colors'
          >
            {user ? user.name || 'Account' : 'Sign In'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
