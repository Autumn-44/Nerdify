import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { AuthContext } from '../context/AuthContext'
import { parseLetterboxdExport } from '../utils/letterboxdImport'
import letterboxdService from '../services/letterboxdService'
import { saveRating } from '../utils/ratingsStorage'
import { addDiaryEntry } from '../utils/diaryStorage'
import { addToWatchlist } from '../utils/watchlistStorage'
import { updateProfilePhoto } from '../services/authService'

function Settings() {
  const navigate = useNavigate()
  const { user, logout, refreshUser } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('account')
  
  // Profile Photo State
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoMessage, setPhotoMessage] = useState('')
  const [photoError, setPhotoError] = useState('')
  
  // Letterboxd Import State
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(null)
  const [importResult, setImportResult] = useState(null)
  const [importError, setImportError] = useState('')

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      navigate('/login')
    }
  }

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setPhotoError('Please select a valid image file')
        setPhotoFile(null)
        setPhotoPreview(null)
        return
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setPhotoError('Image size must be less than 5MB')
        setPhotoFile(null)
        setPhotoPreview(null)
        return
      }

      setPhotoFile(selectedFile)
      setPhotoError('')
      setPhotoMessage('')
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      setPhotoError('Please select a photo first')
      return
    }

    setUploadingPhoto(true)
    setPhotoError('')
    setPhotoMessage('')

    const result = await updateProfilePhoto(photoFile)
    
    if (result.success) {
      setPhotoMessage(result.message)
      setPhotoFile(null)
      setPhotoPreview(null)
      // Refresh user data in context
      if (refreshUser) {
        await refreshUser()
      }
    } else {
      setPhotoError(result.message)
    }

    setUploadingPhoto(false)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setImportError('')
      setImportResult(null)
    } else {
      setImportError('Please select a valid CSV file')
      setFile(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      setImportError('Please select a file first')
      return
    }

    setImporting(true)
    setImportError('')
    setProgress({ current: 0, total: 0, percentage: 0, currentMovie: '' })

    try {
      const text = await file.text()
      const { type, data } = parseLetterboxdExport(text)
      
      if (data.length === 0) {
        setImportError('No data found in the file')
        setImporting(false)
        return
      }

      setProgress({ current: 0, total: data.length, percentage: 0, currentMovie: '' })

      let successCount = 0
      let failCount = 0

      for (let i = 0; i < data.length; i++) {
        const entry = data[i]
        setProgress({
          current: i + 1,
          total: data.length,
          percentage: Math.round(((i + 1) / data.length) * 100),
          currentMovie: entry.Name || entry.title
        })

        try {
          const movieData = await letterboxdService.findMovieByTitleAndYear(entry.Name || entry.title, entry.Year || entry.year)
          
          if (movieData) {
            if (type === 'ratings' && entry.rating) {
              saveRating(String(movieData.id), entry.rating)
            } else if (type === 'diary' && entry.watchedDate) {
              // Format the movie object correctly for addDiaryEntry
              const movieObj = {
                id: movieData.id,
                title: movieData.title,
                poster: movieData.poster || '/placeholder-poster.jpg',
                rating: movieData.rating,
                releaseDate: movieData.year
              }
              addDiaryEntry(
                movieObj,
                entry.watchedDate,
                entry.rating || null,
                entry.review || '',
                ''
              )
            } else if (type === 'watchlist') {
              // Format the movie object correctly for addToWatchlist
              addToWatchlist({
                id: movieData.id,
                title: movieData.title,
                poster: movieData.poster || '/placeholder-poster.jpg',
                rating: movieData.rating,
                releaseDate: movieData.year
              })
            }
            successCount++
          } else {
            failCount++
          }
        } catch (err) {
          console.error(`Error importing ${entry.Name}:`, err)
          failCount++
        }

        await new Promise(resolve => setTimeout(resolve, 300))
      }

      setImportResult({
        type,
        total: data.length,
        success: successCount,
        failed: failCount
      })
      setFile(null)
    } catch (err) {
      console.error('Import error:', err)
      setImportError('Failed to import data. Please check the file format.')
    }

    setImporting(false)
    setProgress(null)
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'import', label: 'Import Data', icon: '📥' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
  ]

  return (
    <MainLayout>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8'>Settings</h1>

        {/* Tabs */}
        <div className='flex gap-2 mb-8 border-b border-gray-700 overflow-x-auto'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-orange-400 border-b-2 border-orange-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className='space-y-6'>
            {/* Profile Photo Section */}
            <div className='bg-[#1c1f26] p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-4'>Profile Photo</h2>
              
              <div className='flex flex-col md:flex-row gap-6 items-start'>
                {/* Current Photo */}
                <div className='flex flex-col items-center gap-3'>
                  <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/30'>
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt='Profile'
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center font-bold text-4xl'
                        style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
                        {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p className='text-sm text-gray-400'>Current Photo</p>
                </div>

                {/* Upload Section */}
                <div className='flex-1 space-y-4'>
                  {photoPreview && (
                    <div className='flex flex-col items-center gap-3'>
                      <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-green-500/30'>
                        <img
                          src={photoPreview}
                          alt='Preview'
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <p className='text-sm text-green-400'>Preview</p>
                    </div>
                  )}

                  {photoError && (
                    <div className='bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg'>
                      {photoError}
                    </div>
                  )}

                  {photoMessage && (
                    <div className='bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg'>
                      {photoMessage}
                    </div>
                  )}

                  <div>
                    <label className='block text-sm font-semibold mb-2'>Select New Photo</label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handlePhotoChange}
                      disabled={uploadingPhoto}
                      className='w-full bg-[#14181c] p-3 rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-semibold hover:file:bg-orange-600 file:cursor-pointer disabled:opacity-50'
                    />
                    <p className='text-xs text-gray-400 mt-2'>Max size: 5MB. Supported formats: JPG, PNG, GIF</p>
                  </div>

                  <button
                    onClick={handlePhotoUpload}
                    disabled={!photoFile || uploadingPhoto}
                    className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {uploadingPhoto ? '⏳ Uploading...' : '📸 Upload Photo'}
                  </button>
                </div>
              </div>
            </div>

            <div className='bg-[#1c1f26] p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-4'>Account Information</h2>
              <div className='space-y-4'>
                <div>
                  <label className='text-gray-400 text-sm'>Email</label>
                  <p className='text-white text-lg'>{user?.email}</p>
                </div>
                <div>
                  <label className='text-gray-400 text-sm'>Display Name</label>
                  <p className='text-white text-lg'>{user?.displayName || 'Not set'}</p>
                </div>
                <div>
                  <label className='text-gray-400 text-sm'>Email Verified</label>
                  <p className='text-white text-lg'>
                    {user?.emailVerified ? (
                      <span className='text-green-400'>✓ Verified</span>
                    ) : (
                      <span className='text-yellow-400'>⚠ Not verified</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-[#1c1f26] p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-4 text-red-400'>Danger Zone</h2>
              <button
                onClick={handleLogout}
                className='w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/50'
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}

        {/* Import Data Tab */}
        {activeTab === 'import' && (
          <div className='space-y-6'>
            <div className='bg-[#1c1f26] p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-4'>Import from Letterboxd</h2>
              <p className='text-gray-400 mb-6'>
                Import your ratings, diary entries, or watchlist from Letterboxd. Export your data from Letterboxd and upload the CSV file here.
              </p>

              <div className='bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6'>
                <h3 className='font-semibold text-blue-400 mb-2'>📋 How to export from Letterboxd:</h3>
                <ol className='space-y-2 text-gray-300'>
                  <li>1. Go to <a href='https://letterboxd.com/settings/data/' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>Letterboxd Settings → Data</a></li>
                  <li>2. Click "Export Your Data"</li>
                  <li>3. Download the ZIP file and extract it</li>
                  <li>4. Upload one of these files: ratings.csv, diary.csv, or watchlist.csv</li>
                </ol>
              </div>

              {importError && (
                <div className='bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4'>
                  {importError}
                </div>
              )}

              {importResult && (
                <div className='bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg mb-4'>
                  <h3 className='font-semibold mb-2'>✓ Import Complete!</h3>
                  <p>Type: {importResult.type}</p>
                  <p>Total: {importResult.total}</p>
                  <p>Success: {importResult.success}</p>
                  <p>Failed: {importResult.failed}</p>
                </div>
              )}

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-semibold mb-2'>Select CSV File</label>
                  <input
                    type='file'
                    accept='.csv'
                    onChange={handleFileChange}
                    disabled={importing}
                    className='w-full bg-[#14181c] p-3 rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-semibold hover:file:bg-orange-600 file:cursor-pointer disabled:opacity-50'
                  />
                  {file && (
                    <p className='text-sm text-gray-400 mt-2'>Selected: {file.name}</p>
                  )}
                </div>

                {progress && (
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-400'>Importing: {progress.currentMovie}</span>
                      <span className='text-orange-400'>{progress.percentage}%</span>
                    </div>
                    <div className='w-full bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className='text-sm text-gray-400 text-center'>
                      {progress.current} / {progress.total} movies
                    </p>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className='w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {importing ? '⏳ Importing...' : '📥 Import Data'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className='space-y-6'>
            <div className='bg-[#1c1f26] p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-4'>Privacy Settings</h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 bg-[#14181c] rounded-lg'>
                  <div>
                    <h3 className='font-semibold'>Public Profile</h3>
                    <p className='text-sm text-gray-400'>Allow others to view your profile</p>
                  </div>
                  <div className='w-12 h-6 bg-orange-500 rounded-full relative'>
                    <div className='absolute right-1 top-1 w-4 h-4 bg-white rounded-full'></div>
                  </div>
                </div>
                
                <div className='flex items-center justify-between p-4 bg-[#14181c] rounded-lg'>
                  <div>
                    <h3 className='font-semibold'>Show Ratings</h3>
                    <p className='text-sm text-gray-400'>Display your ratings publicly</p>
                  </div>
                  <div className='w-12 h-6 bg-orange-500 rounded-full relative'>
                    <div className='absolute right-1 top-1 w-4 h-4 bg-white rounded-full'></div>
                  </div>
                </div>

                <div className='flex items-center justify-between p-4 bg-[#14181c] rounded-lg'>
                  <div>
                    <h3 className='font-semibold'>Show Watchlist</h3>
                    <p className='text-sm text-gray-400'>Make your watchlist visible to others</p>
                  </div>
                  <div className='w-12 h-6 bg-gray-600 rounded-full relative'>
                    <div className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full'></div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-[#1c1f26] p-6 rounded-xl'>
              <h2 className='text-2xl font-bold mb-4'>Data Management</h2>
              <div className='space-y-3'>
                <button className='w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 text-left'>
                  📦 Download My Data
                </button>
                <button className='w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500/50 text-left'>
                  🗑️ Delete All My Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Settings

// Made with Bob
