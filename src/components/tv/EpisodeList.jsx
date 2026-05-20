import { useState, useEffect, useContext } from 'react'
import episodeStorage from '../../utils/episodeStorage'
import { RatingsContext } from '../../context/RatingsContext'
import { addDiaryEntry } from '../../utils/diaryStorage'
import DatePicker from '../common/DatePicker'

const RATING_LABELS = {
  0.5: 'Why was this even made?',
  1: 'Unwatchable',
  1.5: 'Terrible',
  2: 'Very Bad',
  2.5: 'Bad',
  3: 'Poor',
  3.5: 'Below Average',
  4: 'Mediocre',
  4.5: 'Okay',
  5: 'Mid',
  5.5: 'Fine',
  6: 'Decent',
  6.5: 'Good',
  7: 'Very Good',
  7.5: 'Great',
  8: 'Excellent',
  8.5: 'Brilliant',
  9: 'Unbelievable',
  9.5: 'Absolute Cinema',
  10: 'Masterpiece',
}

function getRatingColor(value) {
  if (value <= 3) return '#ef4444'
  if (value <= 5) return '#f97316'
  if (value <= 7) return '#eab308'
  if (value <= 8.5) return '#4ade80'
  return '#22d3ee'
}

function EpisodeList({ show, season }) {
  const [episodes, setEpisodes] = useState([])
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set())
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split('T')[0])
  const [diaryRating, setDiaryRating] = useState(null)
  const [draggingRating, setDraggingRating] = useState(null)
  const [publicReview, setPublicReview] = useState('')
  const [privateNote, setPrivateNote] = useState('')
  const { rate, unrate, getRating } = useContext(RatingsContext)

  useEffect(() => {
    if (season?.episodes) {
      setEpisodes(season.episodes)
      
      // Load watched status
      const watched = new Set()
      season.episodes.forEach(ep => {
        if (episodeStorage.isEpisodeWatched(show.id, season.season_number, ep.episode_number)) {
          watched.add(ep.episode_number)
        }
      })
      setWatchedEpisodes(watched)
    }
  }, [season, show.id])

  const openDiaryModal = (episode) => {
    setSelectedEpisode(episode)
    const ratingKey = `tv-${show.id}-s${season.season_number}e${episode.episode_number}`
    const existingRating = getRating(ratingKey)
    setDiaryRating(existingRating || null)
    setShowDiaryModal(true)
  }

  const handleAddToDiary = () => {
    if (!selectedEpisode) return
    
    // Add to diary
    addDiaryEntry(
      {
        id: `${show.id}-s${season.season_number}e${selectedEpisode.episode_number}`,
        title: `${show.name} - S${season.season_number}E${selectedEpisode.episode_number}: ${selectedEpisode.name}`,
        poster: show.poster_path,
        rating: diaryRating,
        releaseDate: selectedEpisode.air_date,
        mediaType: 'episode',
      },
      diaryDate,
      diaryRating,
      publicReview,
      privateNote
    )
    
    // Save rating
    if (diaryRating) {
      const ratingKey = `tv-${show.id}-s${season.season_number}e${selectedEpisode.episode_number}`
      rate(ratingKey, diaryRating)
    }
    
    // Mark as watched
    if (!watchedEpisodes.has(selectedEpisode.episode_number)) {
      episodeStorage.logEpisode({
        showId: show.id,
        showName: show.name,
        showPoster: show.poster_path,
        seasonNumber: season.season_number,
        episodeNumber: selectedEpisode.episode_number,
        episodeName: selectedEpisode.name,
        episodeOverview: selectedEpisode.overview,
        airDate: selectedEpisode.air_date
      })
      setWatchedEpisodes(prev => new Set([...prev, selectedEpisode.episode_number]))
    }
    
    // Reset and close
    setShowDiaryModal(false)
    setDiaryRating(null)
    setDraggingRating(null)
    setPublicReview('')
    setPrivateNote('')
    setSelectedEpisode(null)
  }

  const handleRatingChange = (e) => {
    setDraggingRating(parseFloat(e.target.value))
  }

  const handleRatingCommit = (e) => {
    const value = parseFloat(e.target.value)
    setDiaryRating(value)
    setDraggingRating(null)
  }

  const toggleEpisodeWatched = (episode) => {
    const isWatched = watchedEpisodes.has(episode.episode_number)
    
    if (isWatched) {
      // Remove from watched
      episodeStorage.removeEpisode(show.id, season.season_number, episode.episode_number)
      setWatchedEpisodes(prev => {
        const newSet = new Set(prev)
        newSet.delete(episode.episode_number)
        return newSet
      })
      
      // Remove rating if exists
      const ratingKey = `tv-${show.id}-s${season.season_number}e${episode.episode_number}`
      unrate(ratingKey)
    } else {
      // Open diary modal instead of just marking watched
      openDiaryModal(episode)
    }
  }

  const getEpisodeRating = (episode) => {
    const ratingKey = `tv-${show.id}-s${season.season_number}e${episode.episode_number}`
    return getRating(ratingKey) || 0
  }

  if (!episodes.length) {
    return (
      <div className='text-center py-8' style={{ color: '#8b949e' }}>
        No episodes available for this season
      </div>
    )
  }

  const displayRating = draggingRating ?? diaryRating
  const ratingColor = displayRating ? getRatingColor(displayRating) : '#6b7280'

  return (
    <>
      <div className='space-y-3'>
        {episodes.map(episode => {
          const isWatched = watchedEpisodes.has(episode.episode_number)
          const rating = getEpisodeRating(episode)
          
          return (
            <div
              key={episode.id}
              className='rounded-lg p-4 transition-all duration-200'
              style={{
                background: isWatched 
                  ? 'linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(34,211,238,0.05) 100%)'
                  : 'rgba(22,27,34,0.6)',
                border: '1px solid',
                borderColor: isWatched ? 'rgba(74,222,128,0.2)' : 'rgba(48,54,61,0.8)'
              }}
            >
              <div className='flex items-start gap-4'>
                {/* Episode Number */}
                <div
                  className='flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg'
                  style={{
                    background: isWatched 
                      ? 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,211,238,0.15) 100%)'
                      : 'rgba(48,54,61,0.8)',
                    color: isWatched ? '#4ade80' : '#8b949e'
                  }}
                >
                  {episode.episode_number}
                </div>

                {/* Episode Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4 mb-2'>
                    <div className='flex-1'>
                      <h4 className='font-semibold mb-1' style={{ color: '#e6edf3' }}>
                        {episode.name}
                      </h4>
                      {episode.air_date && (
                        <p className='text-xs mb-2' style={{ color: '#8b949e' }}>
                          Aired: {new Date(episode.air_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>

                    {/* Log Episode Button */}
                    <button
                      onClick={() => isWatched ? openDiaryModal(episode) : toggleEpisodeWatched(episode)}
                      className='flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200'
                      style={{
                        background: isWatched 
                          ? 'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, rgba(34,211,238,0.15) 100%)'
                          : 'rgba(251,146,60,0.2)',
                        color: isWatched ? '#4ade80' : '#fb923c',
                        border: '1px solid',
                        borderColor: isWatched ? 'rgba(74,222,128,0.3)' : 'rgba(251,146,60,0.3)'
                      }}
                    >
                      {isWatched ? '✓ Logged' : 'Log Episode'}
                    </button>
                  </div>

                  {episode.overview && (
                    <p className='text-sm mb-3 line-clamp-2' style={{ color: '#8b949e' }}>
                      {episode.overview}
                    </p>
                  )}

                  {/* Rating Display */}
                  {rating > 0 && (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold' style={{ color: getRatingColor(rating) }}>
                        ★ {rating.toFixed(1)}/10
                      </span>
                      <span className='text-xs' style={{ color: '#8b949e' }}>
                        {RATING_LABELS[Math.round(rating * 2) / 2] || ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Diary Modal */}
      {showDiaryModal && selectedEpisode && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          onClick={() => setShowDiaryModal(false)}>
          <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-2xl font-black text-white flex items-center gap-2'>
                <span className='text-3xl'>📺</span>
                Log Episode
              </h3>
              <button
                onClick={() => setShowDiaryModal(false)}
                className='text-gray-400 hover:text-white transition-colors'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-6 h-6'>
                  <line x1='18' y1='6' x2='6' y2='18' />
                  <line x1='6' y1='6' x2='18' y2='18' />
                </svg>
              </button>
            </div>

            <div className='mb-4 p-3 bg-white/5 rounded-lg border border-white/10'>
              <p className='text-sm font-semibold text-white'>
                S{season.season_number}E{selectedEpisode.episode_number}: {selectedEpisode.name}
              </p>
            </div>

            <div className='space-y-5'>
              {/* Date */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-2'>
                  📅 When did you watch this episode?
                </label>
                <DatePicker
                  value={diaryDate}
                  onChange={setDiaryDate}
                  maxDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Slider Rating */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-3'>
                  ⭐ Your Rating (Optional)
                </label>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-end gap-3 mb-3'>
                    <span
                      className='text-4xl font-black leading-none tabular-nums transition-colors duration-150'
                      style={{ color: ratingColor }}>
                      {displayRating !== null ? displayRating.toFixed(1) : '--'}
                    </span>
                    <span className='text-gray-500 text-lg mb-1'>/10</span>
                    {displayRating && RATING_LABELS[displayRating] && (
                      <span
                        className='text-sm font-semibold mb-1.5 transition-colors duration-150'
                        style={{ color: ratingColor }}>
                        {RATING_LABELS[displayRating]}
                      </span>
                    )}
                  </div>

                  <input
                    type='range'
                    min='0.5'
                    max='10'
                    step='0.5'
                    value={draggingRating ?? diaryRating ?? 0.5}
                    onChange={handleRatingChange}
                    onMouseUp={handleRatingCommit}
                    onTouchEnd={handleRatingCommit}
                    className='w-full h-2 rounded-full appearance-none cursor-pointer'
                    style={{
                      background: displayRating
                        ? `linear-gradient(to right, ${ratingColor} ${
                            ((displayRating - 0.5) / 9.5) * 100
                          }%, #374151 ${
                            ((displayRating - 0.5) / 9.5) * 100
                          }%)`
                        : '#374151',
                    }}
                  />

                  <div className='flex justify-between text-xs text-gray-500 px-0.5 mt-2'>
                    <span>0.5</span>
                    <span>5</span>
                    <span>10</span>
                  </div>

                  {diaryRating && !draggingRating && (
                    <button
                      onClick={() => {
                        setDiaryRating(null)
                        setDraggingRating(null)
                      }}
                      className='text-xs text-gray-500 hover:text-red-400 transition w-fit underline underline-offset-2 mt-2'>
                      Clear rating
                    </button>
                  )}
                </div>
              </div>

              {/* Public Review */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                    <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                  Public Review (Optional)
                  <span className='text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full'>Visible to everyone</span>
                </label>
                <textarea
                  value={publicReview}
                  onChange={e => setPublicReview(e.target.value)}
                  placeholder='Share your thoughts about this episode...'
                  rows={3}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 outline-none transition-all resize-none'
                />
              </div>

              {/* Private Note */}
              <div>
                <label className='block text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2'>
                  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                    <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                  </svg>
                  Private Note (Optional)
                  <span className='text-xs text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-full'>Only you can see</span>
                </label>
                <textarea
                  value={privateNote}
                  onChange={e => setPrivateNote(e.target.value)}
                  placeholder='Personal notes, reminders, or thoughts...'
                  rows={3}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all resize-none'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-2'>
                <button
                  onClick={() => setShowDiaryModal(false)}
                  className='flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all'>
                  Cancel
                </button>
                <button
                  onClick={handleAddToDiary}
                  className='flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all'
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
                  Log Episode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EpisodeList

// Made with Bob
