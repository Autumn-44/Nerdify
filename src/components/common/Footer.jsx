import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className='border-t border-white/5 mt-16'>
      <div className='max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6'>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 rounded-md bg-green-400 flex items-center justify-center'>
            <span className='text-black font-black text-xs'>N</span>
          </div>
          <span className='font-black text-white'>Nerdify</span>
          <span className='text-gray-600 text-sm ml-2'>© 2026</span>
        </div>

        <div className='flex items-center gap-6 text-sm text-gray-500'>
          <Link to='/' className='hover:text-white transition-colors'>Home</Link>
          <Link to='/search' className='hover:text-white transition-colors'>Search</Link>
          <Link to='/watchlist' className='hover:text-white transition-colors'>Watchlist</Link>
          <Link to='/profile' className='hover:text-white transition-colors'>Profile</Link>
        </div>

        <p className='text-gray-600 text-xs'>
          Movie data provided by TMDB
        </p>
      </div>
    </footer>
  )
}

export default Footer
