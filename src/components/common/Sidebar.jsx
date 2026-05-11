import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='w-[220px] min-h-screen bg-[#1c1f26] p-5'>
      <h2 className='text-xl font-bold mb-6'>Menu</h2>

      <div className='flex flex-col gap-4'>
        <Link to='/'>Home</Link>
        <Link to='/favorites'>Favorites</Link>
        <Link to='/watchlist'>Watchlist</Link>
        <Link to='/diary'>Diary</Link>
        <Link to='/settings'>Settings</Link>
      </div>
    </div>
  )
}

export default Sidebar