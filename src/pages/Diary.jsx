import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { getDiaryEntries, deleteDiaryEntry, getEntriesByMonth, getDatesWithEntries, getWatchingStreak } from '../utils/diaryStorage'

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
  return (
    <div className='group bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-xl p-4 border border-white/10 hover:border-orange-400/30 transition-all duration-200'>
      <div className='flex gap-4'>
        <Link to={`/movie/${entry.movie.id}`} className='flex-shrink-0'>
          <img
            src={entry.movie.poster}
            alt={entry.movie.title}
            className='w-20 h-30 object-cover rounded-lg'
          />
        </Link>
        
        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between gap-2 mb-2'>
            <Link to={`/movie/${entry.movie.id}`} className='flex-1'>
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
          
          <div className='flex items-center gap-3 mb-3 text-sm'>
            <span className='text-gray-400'>
              📅 {new Date(entry.watchedDate).toLocaleDateString('en-US', { 
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
          
          {entry.publicReview && (
            <div className='mb-3 p-3 bg-green-400/5 border border-green-400/20 rounded-lg'>
              <div className='flex items-center gap-2 mb-1'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-3.5 h-3.5 text-green-400'>
                  <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                  <circle cx='9' cy='7' r='4' />
                  <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                  <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                </svg>
                <span className='text-xs font-semibold text-green-400'>Public Review</span>
              </div>
              <p className='text-sm text-gray-300 leading-relaxed'>
                {entry.publicReview}
              </p>
            </div>
          )}
          
          {entry.privateNote && (
            <div className='p-3 bg-purple-400/5 border border-purple-400/20 rounded-lg'>
              <div className='flex items-center gap-2 mb-1'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-3.5 h-3.5 text-purple-400'>
                  <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                  <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                </svg>
                <span className='text-xs font-semibold text-purple-400'>Private Note</span>
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

function Diary() {
  const [entries, setEntries] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [filteredEntries, setFilteredEntries] = useState([])
  const [entriesMap, setEntriesMap] = useState({})

  useEffect(() => {
    loadEntries()
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
    if (confirm('Are you sure you want to delete this diary entry?')) {
      deleteDiaryEntry(entryId)
      loadEntries()
      if (selectedDate) {
        const filtered = entries.filter(e => e.watchedDate === selectedDate && e.id !== entryId)
        setFilteredEntries(filtered)
      }
    }
  }

  const totalMovies = entries.length
  const thisYear = entries.filter(e =>
    new Date(e.watchedDate).getFullYear() === new Date().getFullYear()
  ).length
  const currentStreak = getWatchingStreak()

  return (
    <MainLayout>
      <div className='mb-8'>
        <h1 className='text-4xl font-black mb-2 flex items-center gap-3'>
          <span className='text-5xl'>📔</span>
          My Movie Diary
        </h1>
        <p className='text-gray-400'>Track every movie you watch with dates and notes</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-gradient-to-br from-orange-400/10 to-orange-500/10 rounded-xl p-6 border border-orange-400/20'>
          <div className='text-3xl font-black text-orange-400 mb-1'>{totalMovies}</div>
          <div className='text-sm text-gray-400'>Total Movies Logged</div>
        </div>
        <div className='bg-gradient-to-br from-cyan-400/10 to-cyan-500/10 rounded-xl p-6 border border-cyan-400/20'>
          <div className='text-3xl font-black text-cyan-400 mb-1'>{thisYear}</div>
          <div className='text-sm text-gray-400'>Watched This Year</div>
        </div>
        <div className='bg-gradient-to-br from-purple-400/10 to-purple-500/10 rounded-xl p-6 border border-purple-400/20'>
          <div className='text-3xl font-black text-purple-400 mb-1'>{Object.keys(entriesMap).length}</div>
          <div className='text-sm text-gray-400'>Days with Entries</div>
        </div>
        <div className='bg-gradient-to-br from-green-400/10 to-green-500/10 rounded-xl p-6 border border-green-400/20'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-2xl'>🔥</span>
            <div className='text-3xl font-black text-green-400'>{currentStreak}</div>
          </div>
          <div className='text-sm text-gray-400'>
            {currentStreak === 0
              ? 'No active streak'
              : currentStreak === 1
              ? 'Day streak'
              : 'Day streak'}
          </div>
          {currentStreak > 0 && (
            <div className='text-xs text-green-400/70 mt-1'>
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
    </MainLayout>
  )
}

export default Diary

// Made with Bob
