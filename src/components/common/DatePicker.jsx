import { useState } from 'react'

function DatePicker({ value, onChange, maxDate }) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = value ? new Date(value) : new Date()
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const selectedDate = value ? new Date(value) : null
  const today = new Date()
  const maxDateObj = maxDate ? new Date(maxDate) : today

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    const nextMonthDate = new Date(year, month + 1, 1)
    if (nextMonthDate <= maxDateObj) {
      setCurrentMonth(nextMonthDate)
    }
  }

  const selectDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(dateStr)
    setShowCalendar(false)
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select date'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const date = new Date(year, month, day)
    const isSelected = selectedDate && 
      selectedDate.getDate() === day && 
      selectedDate.getMonth() === month && 
      selectedDate.getFullYear() === year
    const isToday = today.getDate() === day && 
      today.getMonth() === month && 
      today.getFullYear() === year
    const isFuture = date > maxDateObj

    days.push(
      <button
        key={day}
        type='button'
        onClick={() => !isFuture && selectDate(day)}
        disabled={isFuture}
        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
          isFuture
            ? 'text-gray-600 cursor-not-allowed'
            : isSelected
            ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white scale-95 shadow-lg'
            : isToday
            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setShowCalendar(!showCalendar)}
        className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-left text-white hover:bg-white/10 transition-all flex items-center justify-between'
      >
        <span>{formatDisplayDate(value)}</span>
        <svg 
          viewBox='0 0 24 24' 
          fill='none' 
          stroke='currentColor' 
          strokeWidth='2' 
          className='w-5 h-5 text-gray-400'
        >
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
          <line x1='16' y1='2' x2='16' y2='6' />
          <line x1='8' y1='2' x2='8' y2='6' />
          <line x1='3' y1='10' x2='21' y2='10' />
        </svg>
      </button>

      {showCalendar && (
        <>
          <div 
            className='fixed inset-0 z-40' 
            onClick={() => setShowCalendar(false)}
          />
          <div 
            className='absolute top-full left-0 right-0 mt-2 z-50 rounded-lg p-4 border shadow-2xl'
            style={{ 
              background: 'linear-gradient(135deg, #1a1f2e 0%, #161b22 100%)',
              borderColor: 'rgba(255,255,255,0.1)'
            }}
          >
            {/* Month Navigation */}
            <div className='flex items-center justify-between mb-4'>
              <button
                type='button'
                onClick={prevMonth}
                className='p-2 rounded-lg hover:bg-white/10 transition-colors text-white'
              >
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                  <polyline points='15 18 9 12 15 6' />
                </svg>
              </button>
              <h3 className='text-white font-bold'>
                {monthNames[month]} {year}
              </h3>
              <button
                type='button'
                onClick={nextMonth}
                disabled={new Date(year, month + 1, 1) > maxDateObj}
                className='p-2 rounded-lg hover:bg-white/10 transition-colors text-white disabled:opacity-30 disabled:cursor-not-allowed'
              >
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-5 h-5'>
                  <polyline points='9 18 15 12 9 6' />
                </svg>
              </button>
            </div>

            {/* Weekday Headers */}
            <div className='grid grid-cols-7 gap-1 mb-2'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className='text-center text-xs font-semibold text-gray-500 py-1'>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className='grid grid-cols-7 gap-1'>
              {days}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DatePicker

// Made with Bob
