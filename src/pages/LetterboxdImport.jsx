import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { parseLetterboxdExport } from '../utils/letterboxdImport'
import letterboxdService from '../services/letterboxdService'
import { saveRating } from '../utils/ratingsStorage'
import { addDiaryEntry } from '../utils/diaryStorage'
import { addToWatchlist } from '../utils/watchlistStorage'

function LetterboxdImport() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError('')
      setResult(null)
    } else {
      setError('Please select a valid CSV file')
      setFile(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setImporting(true)
    setError('')
    setProgress({ current: 0, total: 0, percentage: 0, currentMovie: '' })

    try {
      // Read file content
      const text = await file.text()
      
      // Parse Letterboxd export
      const { type, data } = parseLetterboxdExport(text)
      
      if (data.length === 0) {
        setError('No data found in the file')
        setImporting(false)
        return
      }

      let importResult

      // Import based on type
      switch (type) {
        case 'diary':
          importResult = await letterboxdService.importDiary(data, setProgress)
          // Save to diary
          importResult.imported.forEach(entry => {
            const movie = {
              id: entry.movieId,
              title: entry.title,
              poster: entry.poster,
            }
            addDiaryEntry(movie, entry.watchedDate, entry.rating, entry.review || '', '')
            // Also save rating if exists
            if (entry.rating) {
              saveRating(entry.movieId, entry.rating)
            }
          })
          break

        case 'ratings':
          importResult = await letterboxdService.importRatings(data, setProgress)
          // Save ratings
          importResult.imported.forEach(entry => {
            saveRating(entry.movieId, entry.rating)
          })
          break

        case 'watchlist':
          importResult = await letterboxdService.importWatchlist(data, setProgress)
          // Save to watchlist
          importResult.imported.forEach(entry => {
            addToWatchlist({
              id: entry.movieId,
              title: entry.title,
              poster: entry.poster,
            })
          })
          break

        case 'watched':
          importResult = await letterboxdService.importWatched(data, setProgress)
          // Save to diary (without ratings)
          importResult.imported.forEach(entry => {
            const movie = {
              id: entry.movieId,
              title: entry.title,
              poster: entry.poster,
            }
            addDiaryEntry(movie, entry.watchedDate, null, '', '')
          })
          break

        default:
          throw new Error('Unknown import type')
      }

      setResult({
        type,
        ...importResult,
      })
    } catch (err) {
      setError(err.message || 'Failed to import data')
      console.error('Import error:', err)
    } finally {
      setImporting(false)
      setProgress(null)
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'diary': return 'Diary Entries'
      case 'ratings': return 'Ratings'
      case 'watchlist': return 'Watchlist'
      case 'watched': return 'Watched Films'
      default: return 'Data'
    }
  }

  return (
    <MainLayout>
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='mb-8'>
          <h1 className='text-4xl font-black mb-2'>Import from Letterboxd</h1>
          <p className='text-gray-400'>
            Bring your Letterboxd data to Nerdify. Export your data from Letterboxd and upload the CSV files here.
          </p>
        </div>

        {/* Instructions */}
        <div className='bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8'>
          <h2 className='text-xl font-bold text-blue-400 mb-3'>📋 How to Export from Letterboxd</h2>
          <ol className='space-y-2 text-gray-300'>
            <li>1. Go to <a href='https://letterboxd.com/settings/data/' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>Letterboxd Settings → Data</a></li>
            <li>2. Click "Export Your Data"</li>
            <li>3. Download the ZIP file and extract it</li>
            <li>4. Upload any of these CSV files:
              <ul className='ml-6 mt-1 space-y-1 text-sm text-gray-400'>
                <li>• <code className='bg-white/5 px-2 py-0.5 rounded'>diary.csv</code> - Your watched films with ratings and reviews</li>
                <li>• <code className='bg-white/5 px-2 py-0.5 rounded'>ratings.csv</code> - Your film ratings</li>
                <li>• <code className='bg-white/5 px-2 py-0.5 rounded'>watchlist.csv</code> - Films you want to watch</li>
                <li>• <code className='bg-white/5 px-2 py-0.5 rounded'>watched.csv</code> - Films you've watched</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Upload Section */}
        <div className='bg-[#1c1f26] rounded-lg p-8 border border-white/10'>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Select Letterboxd CSV File
            </label>
            <input
              type='file'
              accept='.csv'
              onChange={handleFileChange}
              disabled={importing}
              className='block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-green-400/20 file:text-green-400
                hover:file:bg-green-400/30
                file:cursor-pointer cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed'
            />
            {file && (
              <p className='mt-2 text-sm text-gray-400'>
                Selected: <span className='text-white'>{file.name}</span>
              </p>
            )}
          </div>

          {error && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400'>
              {error}
            </div>
          )}

          {progress && (
            <div className='mb-6'>
              <div className='flex justify-between text-sm text-gray-400 mb-2'>
                <span>Importing: {progress.currentMovie}</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-green-400 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className='text-center text-sm text-gray-400 mt-2'>
                {progress.percentage}% complete
              </p>
            </div>
          )}

          {result && (
            <div className='mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-lg'>
              <h3 className='text-xl font-bold text-green-400 mb-4'>✅ Import Complete!</h3>
              <div className='space-y-2 text-gray-300'>
                <p>Type: <span className='text-white font-semibold'>{getTypeLabel(result.type)}</span></p>
                <p>Total: <span className='text-white font-semibold'>{result.stats.total}</span></p>
                <p>Successfully imported: <span className='text-green-400 font-semibold'>{result.stats.successful}</span></p>
                {result.stats.failed > 0 && (
                  <p>Failed to match: <span className='text-yellow-400 font-semibold'>{result.stats.failed}</span></p>
                )}
              </div>
              
              {result.failed.length > 0 && (
                <details className='mt-4'>
                  <summary className='cursor-pointer text-yellow-400 hover:text-yellow-300'>
                    View unmatched films ({result.failed.length})
                  </summary>
                  <ul className='mt-2 space-y-1 text-sm text-gray-400 max-h-40 overflow-y-auto'>
                    {result.failed.map((entry, idx) => (
                      <li key={idx}>• {entry.title} ({entry.year})</li>
                    ))}
                  </ul>
                </details>
              )}

              <div className='flex gap-3 mt-6'>
                <button
                  onClick={() => {
                    if (result.type === 'diary') navigate('/diary')
                    else if (result.type === 'ratings') navigate('/profile')
                    else if (result.type === 'watchlist') navigate('/watchlist')
                    else navigate('/diary')
                  }}
                  className='px-6 py-2 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-300 transition-colors'
                >
                  View Imported Data
                </button>
                <button
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                    setError('')
                  }}
                  className='px-6 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors'
                >
                  Import Another File
                </button>
              </div>
            </div>
          )}

          {!result && (
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className='w-full py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {importing ? 'Importing...' : 'Start Import'}
            </button>
          )}
        </div>

        {/* Info Box */}
        <div className='mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
          <h3 className='text-lg font-bold text-yellow-400 mb-2'>⚠️ Important Notes</h3>
          <ul className='space-y-1 text-sm text-gray-300'>
            <li>• The import process may take a few minutes depending on the file size</li>
            <li>• Letterboxd ratings (0.5-5 stars) will be converted to Nerdify's 10-point scale</li>
            <li>• Some films may not be matched if they're not in TMDB database</li>
            <li>• Imported data will be merged with your existing Nerdify data</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}

export default LetterboxdImport

// Made with Bob