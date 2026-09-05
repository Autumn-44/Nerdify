import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { getWatchlist, removeFromWatchlist } from '../utils/watchlistStorage'
import { 
  getAllFolders, 
  getMoviesInFolder, 
  removeMovieFromFolder,
  deleteFolder,
  renameFolder 
} from '../utils/watchlistFolders'
import useRatings from '../hooks/useRatings'

function WatchlistCard({ movie, onRemove }) {
  const { getRating } = useRatings()
  const userRating = getRating(String(movie.id))

  return (
    <div className='group flex gap-4 bg-[#1c1f26] rounded-xl p-4 hover:bg-[#22262e] transition-all duration-200'>
      <Link to={`/movie/${movie.id}`} className='flex-shrink-0'>
        <img
          src={movie.poster}
          alt={movie.title}
          className='w-16 h-24 object-cover rounded-lg'
        />
      </Link>

      <div className='flex-1 min-w-0'>
        <Link to={`/movie/${movie.id}`}>
          <h3 className='font-bold text-lg hover:text-primary-400 transition-colors truncate'>
            {movie.title}
          </h3>
        </Link>
        <p className='text-gray-500 text-sm mt-0.5'>{movie.releaseDate?.slice(0, 4)}</p>

        <div className='flex items-center gap-3 mt-2'>
          <span className='text-yellow-400 text-sm'>⭐ {movie.rating}</span>
          {userRating && (
            <span className='text-primary-400 text-sm font-semibold'>
              Your rating: {userRating}/10
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onRemove(movie.id)}
        className='opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all self-start mt-1 text-lg'
        title='Remove from watchlist'
      >
        ✕
      </button>
    </div>
  )
}

function WatchlistNew() {
  const [allMovies, setAllMovies] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [filteredMovies, setFilteredMovies] = useState([])
  const [editingFolder, setEditingFolder] = useState(null)
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterMovies()
  }, [selectedFolder, allMovies])

  const loadData = () => {
    const movies = getWatchlist()
    const folderList = getAllFolders()
    setAllMovies(movies)
    setFolders(folderList)
  }

  const filterMovies = () => {
    if (selectedFolder === 'all') {
      setFilteredMovies(allMovies)
    } else {
      const movieIds = getMoviesInFolder(selectedFolder)
      const filtered = allMovies.filter(m => movieIds.includes(m.id))
      setFilteredMovies(filtered)
    }
  }

  const handleRemove = (movieId) => {
    if (selectedFolder === 'all') {
      removeFromWatchlist(movieId)
      setAllMovies(prev => prev.filter(m => m.id !== movieId))
    } else {
      removeMovieFromFolder(movieId, selectedFolder)
      filterMovies()
    }
  }

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('Delete this folder? Movies will remain in your watchlist.')) {
      deleteFolder(folderId)
      setFolders(getAllFolders())
      if (selectedFolder === folderId) {
        setSelectedFolder('all')
      }
    }
  }

  const handleRenameFolder = (folderId) => {
    if (newFolderName.trim()) {
      renameFolder(folderId, newFolderName.trim())
      setFolders(getAllFolders())
      setEditingFolder(null)
      setNewFolderName('')
    }
  }

  return (
    <MainLayout>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl sm:text-4xl font-black mb-2' style={{ color: '#e6edf3' }}>My Watchlist</h1>
          <p className='text-gray-400'>
            {allMovies.length} {allMovies.length === 1 ? 'film' : 'films'} saved
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Sidebar - Folders */}
          <div className='md:col-span-1'>
            <div className='bg-[#1c1f26] rounded-xl p-4 border border-white/10 md:sticky md:top-20'>
              <h2 className='text-sm font-bold text-gray-400 uppercase tracking-wider mb-4'>
                Collections
              </h2>
              <div className='space-y-1'>
                {folders.map(folder => (
                  <div key={folder.id} className='group'>
                    {editingFolder === folder.id ? (
                      <div className='flex gap-2 p-2'>
                        <input
                          type='text'
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                          className='flex-1 bg-[#22262e] border border-white/10 rounded px-2 py-1 text-sm text-white'
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameFolder(folder.id)}
                          className='text-primary-400 hover:text-primary-300 text-xs'
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setEditingFolder(null)
                            setNewFolderName('')
                          }}
                          className='text-gray-400 hover:text-white text-xs'
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedFolder(folder.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                          selectedFolder === folder.id
                            ? 'bg-primary-500/20 text-primary-400 font-semibold'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <span className='text-xl'>{folder.icon}</span>
                        <span className='flex-1 truncate'>{folder.name}</span>
                        {!folder.isDefault && selectedFolder === folder.id && (
                          <div className='flex gap-1 opacity-0 group-hover:opacity-100'>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingFolder(folder.id)
                                setNewFolderName(folder.name)
                              }}
                              className='text-gray-400 hover:text-primary-400 p-1'
                              title='Rename'
                            >
                              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-3.5 h-3.5'>
                                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteFolder(folder.id)
                              }}
                              className='text-gray-400 hover:text-red-400 p-1'
                              title='Delete'
                            >
                              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-3.5 h-3.5'>
                                <polyline points='3 6 5 6 21 6' />
                                <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                              </svg>
                            </button>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Movies */}
          <div className='md:col-span-3'>
            {filteredMovies.length === 0 ? (
              <div className='text-center py-24 bg-[#1c1f26] rounded-xl border border-white/10'>
                <p className='text-5xl mb-4'>🎬</p>
                <h2 className='text-xl font-bold mb-2'>No movies in this collection</h2>
                <p className='text-gray-500 mb-6'>
                  {selectedFolder === 'all' 
                    ? 'Add films from their detail pages to track what you want to watch.'
                    : 'Add movies to this folder from movie detail pages.'}
                </p>
                <Link
                  to='/search'
                  className='inline-flex px-5 py-2.5 rounded-lg font-bold transition-all'
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}
                >
                  Find something to watch
                </Link>
              </div>
            ) : (
              <div className='space-y-3'>
                {filteredMovies.map(movie => (
                  <WatchlistCard key={movie.id} movie={movie} onRemove={handleRemove} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default WatchlistNew

// Made with Bob
