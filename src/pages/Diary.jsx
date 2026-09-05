import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { getDiaryEntries, deleteDiaryEntry, getEntriesByMonth, getDatesWithEntries, getWatchingStreak } from '../utils/diaryStorage'
import episodeStorage from '../utils/episodeStorage'

function Calendar({ selectedDate, onDateSelect, entriesMap }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }
  
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className='aspect-square' />)
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const hasEntries = entriesMap[date] > 0
    const isSelected = selectedDate === date
    const isToday = date === new Date().toISOString().split('T')[0]
    
    days.push(
      <button
        key={day}
        onClick={() => onDateSelect(date)}
        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-semibold transition-all duration-200 ${
          isSelected
            ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white scale-95 shadow-lg'
            : hasEntries
            ? 'bg-orange-400/20 text-orange-400 hover:bg-orange-400/30 border border-orange-400/30'
            : isToday
            ? 'bg-white/5 text-white border border-white/20 hover:bg-white/10'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}>
        <span>{day}</span>
        {hasEntries && !isSelected && (
          <span className='w-1 h-1 rounded-full bg-orange-400 mt-1' />
        )}
      </button>
    )
  }
  
  return (
    <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-6 border border-white/10'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-black text-white'>
          {monthNames[month]} {year}
        </h2>
        <div className='flex gap-2'>
          <button
            onClick={prevMonth}
            className='w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors'>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
              <polyline points='15 18 9 12 15 6' />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className='w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors'>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
              <polyline points='9 18 15 12 9 6' />
            </svg>
          </button>
        </div>
      </div>
      
      <div className='grid grid-cols-7 gap-2 mb-2'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className='text-center text-xs font-bold text-gray-500 py-2'>
            {day}
          </div>
        ))}
      </div>
      
      <div className='grid grid-cols-7 gap-2'>
        {days}
      </div>
    </div>
  )
}

function DiaryEntry({ entry, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Determine the correct link based on media type
  const getLink = () => {
    if (entry.movie.mediaType === 'episode') {
      // Extract show ID from episode ID format: "showId-s1e2"
      const showId = entry.movie.id.split('-')[0]
      return `/tv/${showId}`
    } else if (entry.movie.mediaType === 'tv') {
      return `/tv/${entry.movie.id}`
    }
    return `/movie/${entry.movie.id}`
  }
  
  const linkPath = getLink()
  
  return (
    <div className='group bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-xl p-4 border border-white/10 hover:border-orange-400/30 transition-all duration-200'>
      <div className='flex gap-4'>
        <Link to={linkPath} className='flex-shrink-0'>
          <img
            src={entry.movie.poster}
            alt={entry.movie.title}
            className='w-20 h-30 object-cover rounded-lg'
          />
        </Link>
        
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2 mb-2'>
            <Link to={linkPath} className='flex-1'>
              <h3 className='font-bold text-lg text-white hover:text-orange-400 transition-colors line-clamp-1'>
                {entry.movie.title}
              </h3>
            </Link>
            <button
              onClick={() => onDelete(entry.id)}
              className='opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1'>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                <polyline points='3 6 5 6 21 6' />
                <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
              </svg>
            </button>
          </div>
          
          <div className='space-y-2 mb-3'>
            <div className='flex items-center gap-3 text-sm'>
              <span className='text-gray-400'>
                📅 Watched: {new Date(entry.watchedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {entry.rating && (
                <span className='flex items-center gap-1 text-orange-400 font-semibold'>
                  <svg viewBox='0 0 24 24' fill='currentColor' className='w-4 h-4'>
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                  {entry.rating}/10
                </span>
              )}
            </div>
            
            {entry.createdAt && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors'>
                <span>📝 Logged on {new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  <polyline points='6 9 12 15 18 9' />
                </svg>
              </button>
            )}
          </div>
          
          {entry.publicReview && isExpanded && (
            <div className='mb-3 p-3 bg-primary-400/5 border border-primary-400/20 rounded-lg animate-fadeIn'>
              <div className='flex items-center gap-2 mb-1'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-3.5 h-3.5 text-primary-400'>
                  <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                  <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                </svg>
                <span className='text-xs font-semibold text-primary-400'>Public Review</span>
              </div>
              <p className='text-sm text-gray-300 leading-relaxed'>
                {entry.publicReview}
              </p>
            </div>
          )}
          
          {entry.privateNote && isExpanded && (
            <div className='p-3 bg-accent-400/5 border border-accent-400/20 rounded-lg animate-fadeIn'>
              <div className='flex items-center gap-2 mb-1'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-3.5 h-3.5 text-accent-400'>
                  <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                  <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                </svg>
                <span className='text-xs font-semibold text-accent-400'>Private Note</span>
              </div>
              <p className='text-sm text-gray-300 leading-relaxed'>
                {entry.privateNote}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const getEpisodeParts = (entry) => {
  const movie = entry.movie || {}
  const idMatch = String(movie.id || '').match(/^(.+)-s(\d+)e(\d+)$/i)

  return {
    showId: movie.showId ?? idMatch?.[1],
    seasonNumber: Number(movie.seasonNumber ?? idMatch?.[2]),
    episodeNumber: Number(movie.episodeNumber ?? idMatch?.[3]),
    seasonEpisodeCount: Number(movie.seasonEpisodeCount || 0),
  }
}

const getCompletedSeriesCount = (entries) => {
  const watchedSeries = new Set(
    entries
      .filter(e => e.movie?.mediaType === 'tv')
      .map(e => String(e.movie.id))
  )
  const seasonsByShow = {}

  entries
    .filter(e => e.movie?.mediaType === 'episode')
    .forEach(entry => {
      const { showId, seasonNumber, episodeNumber, seasonEpisodeCount } = getEpisodeParts(entry)
      if (!showId || !seasonNumber || !episodeNumber) return

      const showKey = String(showId)
      const seasonKey = String(seasonNumber)

      if (!seasonsByShow[showKey]) seasonsByShow[showKey] = {}
      if (!seasonsByShow[showKey][seasonKey]) {
        seasonsByShow[showKey][seasonKey] = {
          expectedCount: seasonEpisodeCount,
          episodes: new Set(),
        }
      }

      seasonsByShow[showKey][seasonKey].episodes.add(episodeNumber)
      if (seasonEpisodeCount > 0) {
        seasonsByShow[showKey][seasonKey].expectedCount = seasonEpisodeCount
      }
    })

  Object.entries(seasonsByShow).forEach(([showId, seasons]) => {
    const hasCompletedSeason = Object.values(seasons).some(season => {
      const watchedCount = season.episodes.size
      const highestEpisode = Math.max(...season.episodes)
      const hasWatchedFromStart = Array.from(
        { length: highestEpisode },
        (_, index) => season.episodes.has(index + 1)
      ).every(Boolean)

      if (season.expectedCount > 0) {
        return watchedCount >= season.expectedCount
      }

      return watchedCount > 1 && watchedCount === highestEpisode && hasWatchedFromStart
    })

    if (hasCompletedSeason) {
      watchedSeries.add(showId)
    }
  })

  return watchedSeries.size
}

function Diary() {
  const [entries, setEntries] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [filteredEntries, setFilteredEntries] = useState([])
  const [entriesMap, setEntriesMap] = useState({})
  const [entryToDelete, setEntryToDelete] = useState(null)

  useEffect(() => {
    loadEntries()
  }, [])
  
  useEffect(() => {
    // Reload entries when component becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadEntries()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', loadEntries)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', loadEntries)
    }
  }, [])

  const loadEntries = () => {
    const allEntries = getDiaryEntries()
    setEntries(allEntries)
    setFilteredEntries(allEntries)
    
    // Create a map of dates to entry counts
    const map = {}
    allEntries.forEach(entry => {
      map[entry.watchedDate] = (map[entry.watchedDate] || 0) + 1
    })
    setEntriesMap(map)
  }

  const handleDateSelect = (date) => {
    if (selectedDate === date) {
      setSelectedDate(null)
      setFilteredEntries(entries)
    } else {
      setSelectedDate(date)
      const filtered = entries.filter(e => e.watchedDate === date)
      setFilteredEntries(filtered)
    }
  }

  const handleDelete = (entryId) => {
    const entry = entries.find(e => e.id === entryId)
    setEntryToDelete(entry || { id: entryId })
  }

  const confirmDelete = () => {
    if (!entryToDelete) return

    deleteDiaryEntry(entryToDelete.id)
    const updatedEntries = getDiaryEntries()
    setEntries(updatedEntries)

    const map = {}
    updatedEntries.forEach(entry => {
      map[entry.watchedDate] = (map[entry.watchedDate] || 0) + 1
    })
    setEntriesMap(map)

    if (selectedDate) {
      setFilteredEntries(updatedEntries.filter(e => e.watchedDate === selectedDate))
    } else {
      setFilteredEntries(updatedEntries)
    }

    setEntryToDelete(null)
  }

  const totalMovies = entries.length
  const films = entries.filter(e => !e.movie.mediaType || e.movie.mediaType === 'movie')
  const series = entries.filter(e => e.movie.mediaType === 'tv')
  const episodes = entries.filter(e => e.movie.mediaType === 'episode')
  const completedSeriesCount = getCompletedSeriesCount(entries)
  
  console.log('Diary entries breakdown:', {
    total: entries.length,
    films: films.length,
    series: completedSeriesCount,
    episodes: episodes.length,
    sample: entries.slice(0, 3).map(e => ({ title: e.movie.title, mediaType: e.movie.mediaType }))
  })
  
  const thisYearFilms = films.filter(e =>
    new Date(e.watchedDate).getFullYear() === new Date().getFullYear()
  ).length
  
  const thisYearSeries = getCompletedSeriesCount(
    entries.filter(e => new Date(e.watchedDate).getFullYear() === new Date().getFullYear())
  )
  
  const thisYearEpisodes = episodes.filter(e =>
    new Date(e.watchedDate).getFullYear() === new Date().getFullYear()
  ).length
  
  const currentStreak = getWatchingStreak()

  return (
    <MainLayout>
      <div className='mb-8'>
        <h1 className='text-2xl sm:text-4xl font-black mb-2'>
          My Diary
        </h1>
        <p className='text-gray-400'>
          Watched {thisYearFilms} {thisYearFilms === 1 ? 'film' : 'films'} and {thisYearSeries} {thisYearSeries === 1 ? 'series' : 'series'} this year
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8'>
        <div className='bg-gradient-to-br from-orange-400/10 to-orange-500/10 rounded-xl p-6 border border-orange-400/20'>
          <div className='text-3xl font-black text-orange-400 mb-1'>{films.length}</div>
          <div className='text-sm text-gray-400'>Films Logged</div>
        </div>
        <div className='bg-gradient-to-br from-primary-400/10 to-primary-500/10 rounded-xl p-6 border border-primary-400/20'>
          <div className='text-3xl font-black text-primary-400 mb-1'>{completedSeriesCount}</div>
          <div className='text-sm text-gray-400'>Series Logged</div>
        </div>
        <div className='bg-gradient-to-br from-blue-400/10 to-blue-500/10 rounded-xl p-6 border border-blue-400/20'>
          <div className='text-3xl font-black text-blue-400 mb-1'>{episodes.length}</div>
          <div className='text-sm text-gray-400'>Episodes Logged</div>
        </div>
        <div className='bg-gradient-to-br from-accent-400/10 to-accent-500/10 rounded-xl p-6 border border-accent-400/20'>
          <div className='text-3xl font-black text-accent-400 mb-1'>{Object.keys(entriesMap).length}</div>
          <div className='text-sm text-gray-400'>Days with Entries</div>
        </div>
        <div className='bg-gradient-to-br from-primary-400/10 to-primary-500/10 rounded-xl p-6 border border-primary-400/20'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-2xl'></span>
            <div className='text-3xl font-black text-primary-400'>{currentStreak}</div>
          </div>
          <div className='text-sm text-gray-400'>
            {currentStreak === 0
              ? 'No active streak'
              : currentStreak === 1
              ? 'Day streak'
              : 'Day streak'}
          </div>
          {currentStreak > 0 && (
            <div className='text-xs text-primary-400/70 mt-1'>
              Keep watching daily!
            </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Calendar */}
        <div className='lg:col-span-1'>
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            entriesMap={entriesMap}
          />
          
          {selectedDate && (
            <div className='mt-4 p-4 bg-orange-400/10 rounded-xl border border-orange-400/20'>
              <p className='text-sm text-orange-400 font-semibold'>
                📅 Showing entries for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
              <button
                onClick={() => {
                  setSelectedDate(null)
                  setFilteredEntries(entries)
                }}
                className='text-xs text-gray-400 hover:text-white mt-2 transition-colors'>
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Entries List */}
        <div className='lg:col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-black text-white'>
              {selectedDate ? 'Entries for Selected Date' : 'All Entries'}
            </h2>
            <span className='text-sm text-gray-400'>
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>

          {filteredEntries.length === 0 ? (
            <div className='text-center py-20'>
              <p className='text-5xl mb-4'>🎬</p>
              <h3 className='text-xl font-bold mb-2 text-white'>No entries yet</h3>
              <p className='text-gray-400 mb-6'>
                {selectedDate 
                  ? 'No movies watched on this date'
                  : 'Start logging movies from their detail pages'}
              </p>
              {!selectedDate && (
                <Link
                  to='/search'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200'
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
                  Find Movies to Watch
                </Link>
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredEntries.map(entry => (
                <DiaryEntry key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>

      {entryToDelete && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4'>
          <div className='w-full max-w-md rounded-2xl border border-red-400/20 bg-gradient-to-br from-[#1a1f2e] to-[#161b22] p-6 shadow-2xl shadow-black/50'>
            <div className='mb-5 flex items-start gap-4'>
              <div className='flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-red-400 ring-1 ring-red-400/20'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='h-5 w-5'>
                  <polyline points='3 6 5 6 21 6' />
                  <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-black text-white'>Delete diary entry?</h3>
                <p className='mt-2 text-sm leading-relaxed text-gray-400'>
                  {entryToDelete.movie?.title
                    ? `Remove "${entryToDelete.movie.title}" from your diary? This action cannot be undone.`
                    : 'Remove this diary entry? This action cannot be undone.'}
                </p>
              </div>
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setEntryToDelete(null)}
                className='rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white'>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-400'>
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default Diary

// Made with Bob
