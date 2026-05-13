import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className='flex justify-between items-center px-10 py-5 border-b border-gray-800'>
      <Link
        to='/'
        className='text-4xl font-black text-green-400'
      >
        Nerdify
      </Link>

      <div className='flex items-center gap-6'>
        <Link to='/'>Home</Link>

        <Link to='/search'>Search</Link>

        <Link to='/watchlist'>Watchlist</Link>

        {user ? (
          <>
            <span className='text-green-400'>
              {user.name}
            </span>

            <button
              onClick={logout}
              className='bg-red-500 px-4 py-2 rounded-lg'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>

            <Link to='/register'>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar