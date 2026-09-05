import { useState } from 'react'
import { getAllFolders, createFolder } from '../../utils/watchlistFolders'

function FolderSelectionModal({ isOpen, onClose, onSelectFolders, movieTitle }) {
  const [selectedFolders, setSelectedFolders] = useState(['all'])
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [folders, setFolders] = useState(getAllFolders())

  if (!isOpen) return null

  const toggleFolder = (folderId) => {
    if (folderId === 'all') {
      // 'All' is always selected
      return
    }
    
    setSelectedFolders(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId)
      } else {
        return [...prev, folderId]
      }
    })
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = createFolder(newFolderName.trim())
      setFolders(getAllFolders())
      setSelectedFolders(prev => [...prev, newFolder.id])
      setNewFolderName('')
      setShowCreateFolder(false)
    }
  }

  const handleSave = () => {
    onSelectFolders(selectedFolders)
    onClose()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className='bg-[#1c1f26] rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl'>
        {/* Header */}
        <div className='p-6 border-b border-white/10'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-2xl font-black' style={{ color: '#e6edf3' }}>
              Add to Watchlist
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-white transition-colors p-1'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-6 h-6'>
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </div>
          <p className='text-sm text-gray-400 truncate'>{movieTitle}</p>
        </div>

        {/* Folder List */}
        <div className='p-6 overflow-y-auto max-h-[50vh]'>
          <p className='text-sm font-semibold text-gray-400 mb-3'>Select folders:</p>
          <div className='space-y-2'>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => toggleFolder(folder.id)}
                disabled={folder.id === 'all'}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  selectedFolders.includes(folder.id)
                    ? 'bg-primary-500/20 border-2 border-primary-400/50'
                    : 'bg-[#22262e] border-2 border-transparent hover:border-white/10'
                } ${folder.id === 'all' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className='text-2xl'>{folder.icon}</span>
                <span className='flex-1 text-left font-semibold' style={{ color: '#e6edf3' }}>
                  {folder.name}
                </span>
                {selectedFolders.includes(folder.id) && (
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' className='w-5 h-5 text-primary-400'>
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Create New Folder */}
          {!showCreateFolder ? (
            <button
              onClick={() => setShowCreateFolder(true)}
              className='w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-white/20 hover:border-primary-400/50 transition-all text-gray-400 hover:text-primary-400'
            >
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                <line x1='12' y1='5' x2='12' y2='19' />
                <line x1='5' y1='12' x2='19' y2='12' />
              </svg>
              <span className='font-semibold'>Create New Folder</span>
            </button>
          ) : (
            <div className='mt-4 p-4 bg-[#22262e] rounded-lg border border-white/10'>
              <input
                type='text'
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder='Folder name...'
                className='w-full bg-[#1c1f26] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400/50 mb-3'
                autoFocus
              />
              <div className='flex gap-2'>
                <button
                  onClick={handleCreateFolder}
                  className='flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all'
                  style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateFolder(false)
                    setNewFolderName('')
                  }}
                  className='flex-1 px-4 py-2 rounded-lg font-bold text-sm bg-[#1c1f26] text-gray-400 hover:text-white transition-all'
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-6 border-t border-white/10 flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-6 py-3 rounded-xl font-bold text-sm bg-[#22262e] text-gray-400 hover:text-white transition-all'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg'
            style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: '#0f172a' }}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  )
}

export default FolderSelectionModal

// Made with Bob
