import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className='mt-20 border-t' style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0a0e14' }}>
      <div className='max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6'>
        <Link to='/' className='flex items-center gap-3 group'>
          <span className='h-9 w-9 rounded-xl overflow-hidden opacity-85 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary-400/10'>
            <img src='/logo.png' alt='Nerdify logo' className='h-full w-full object-cover' />
          </span>
          <span className='font-black text-sm' style={{ color: '#8b949e' }}>Nerdify</span>
        </Link>

        <div className='flex items-center gap-6 text-xs' style={{ color: '#8b949e' }}>
          {[['/', 'Home'], ['/search', 'Search'], ['/watchlist', 'Watchlist'], ['/profile', 'Profile']].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className='transition-colors hover:text-white'
            >
              {label}
            </Link>
          ))}
        </div>

        <p className='text-xs' style={{ color: '#484f58' }}>
          Powered by TMDB · © 2026 Nerdify
        </p>
      </div>
    </footer>
  )
}

export default Footer
