import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='bg-[#14181c] text-white px-8 py-4 flex justify-between items-center border-b border-gray-700'>
      <Link to='/' className='text-2xl font-bold text-green-400'>
        Nerdify
      </Link>

      <div className='flex gap-6'>
        <Link to='/'>Home</Link>
        <Link to='/search'>Search</Link>
        <Link to='/watchlist'>Watchlist</Link>
        <Link to='/profile'>Profile</Link>
        <Link to='/login'>Login</Link>
      </div>
    </nav>
  )
}

export default Navbar
