import { useState, useContext } from 'react'
import EpisodeList from './EpisodeList'
import episodeStorage from '../../utils/episodeStorage'
import tvShowService from '../../services/tvShowService'
import Loader from '../common/Loader'
import { RatingsContext } from '../../context/RatingsContext'

function getRatingColor(value) {
  if (value <= 3) return '#ef4444'
  if (value <= 5) return '#f97316'
  if (value <= 7) return '#eab308'
  if (value <= 8.5) return '#4ade80'
  return '#22d3ee'
}

function SeasonList({ show, seasons }) {
  const [expandedSeason, setExpandedSeason] = useState(null)
  const [seasonDetails, setSeasonDetails] = useState({})
  const [loadingSeasons, setLoadingSeasons] = useState({})
  const { getRating } = useContext(RatingsContext)

  const toggleSeason = async (seasonNumber) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null)
      return
    }

    setExpandedSeason(seasonNumber)

    // Fetch season details if not already loaded
    if (!seasonDetails[seasonNumber]) {
      setLoadingSeasons(prev => ({ ...prev, [seasonNumber]: true }))
      try {
        const details = await tvShowService.getSeasonDetails(show.id, seasonNumber)
        setSeasonDetails(prev => ({ ...prev, [seasonNumber]: details }))
      } catch (error) {
        console.error('Error loading season details:', error)
      } finally {
        setLoadingSeasons(prev => ({ ...prev, [seasonNumber]: false }))
      }
    }
  }

  const getSeasonProgress = (seasonNumber) => {
    const progress = episodeStorage.getShowProgress(show.id)
    return progress.seasonProgress[seasonNumber] || { watched: 0, episodes: [] }
  }

  const getSeasonAverageRating = (seasonNumber, episodeCount) => {
    if (!seasonDetails[seasonNumber]?.episodes) return null
    
    const episodes = seasonDetails[seasonNumber].episodes
    let totalRating = 0
    let ratedCount = 0
    
    episodes.forEach(ep => {
      const ratingKey = `tv-${show.id}-s${seasonNumber}e${ep.episode_number}`
      const rating = getRating(ratingKey)
      if (rating) {
        totalRating += rating
        ratedCount++
      }
    })
    
    // Only show average if all episodes are rated
    if (ratedCount === episodeCount && ratedCount > 0) {
      return totalRating / ratedCount
    }
    
    return null
  }

  if (!seasons || seasons.length === 0) {
    return (
      <div className='text-center py-8' style={{ color: '#8b949e' }}>
        No seasons available
      </div>
    )
  }

  // Filter out season 0 (specials) by default, but show if it has episodes
  const filteredSeasons = seasons.filter(s => s.season_number > 0 || s.episode_count > 0)

  return (
    <div className='space-y-4'>
      {filteredSeasons.map(season => {
        const isExpanded = expandedSeason === season.season_number
        const progress = getSeasonProgress(season.season_number)
        const progressPercent = season.episode_count > 0
          ? Math.round((progress.watched / season.episode_count) * 100)
          : 0
        const averageRating = getSeasonAverageRating(season.season_number, season.episode_count)

        return (
          <div
            key={season.id}
            className='rounded-lg overflow-hidden transition-all duration-200'
            style={{
              background: 'rgba(22,27,34,0.6)',
              border: '1px solid rgba(48,54,61,0.8)'
            }}
          >
            {/* Season Header */}
            <button
              onClick={() => toggleSeason(season.season_number)}
              className='w-full p-4 flex items-center gap-4 hover:bg-opacity-80 transition-all duration-200'
              style={{ background: 'rgba(22,27,34,0.4)' }}
            >
              {/* Season Poster */}
              {season.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${season.poster_path}`}
                  alt={season.name}
                  className='w-16 h-24 object-cover rounded'
                  style={{ border: '1px solid rgba(48,54,61,0.8)' }}
                />
              )}

              {/* Season Info */}
              <div className='flex-1 text-left'>
                <h3 className='font-bold text-lg mb-1' style={{ color: '#e6edf3' }}>
                  {season.name}
                </h3>
                <div className='flex items-center gap-3 mb-2'>
                  <p className='text-sm' style={{ color: '#8b949e' }}>
                    {season.episode_count} {season.episode_count === 1 ? 'Episode' : 'Episodes'}
                    {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                  </p>
                  {averageRating && (
                    <div className='flex items-center gap-1.5 px-2 py-1 rounded-md' style={{ background: 'rgba(251,191,36,0.1)' }}>
                      <span className='text-sm font-bold' style={{ color: getRatingColor(averageRating) }}>
                        ★ {averageRating.toFixed(1)}
                      </span>
                      <span className='text-xs' style={{ color: '#8b949e' }}>avg</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {progress.watched > 0 && (
                  <div className='space-y-1'>
                    <div className='flex items-center justify-between text-xs'>
                      <span style={{ color: '#4ade80' }}>
                        {progress.watched} / {season.episode_count} watched
                      </span>
                      <span style={{ color: '#4ade80' }}>
                        {progressPercent}%
                      </span>
                    </div>
                    <div
                      className='h-1.5 rounded-full overflow-hidden'
                      style={{ background: 'rgba(48,54,61,0.8)' }}
                    >
                      <div
                        className='h-full transition-all duration-500'
                        style={{
                          width: `${progressPercent}%`,
                          background: 'linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Expand Icon */}
              <div
                className='text-2xl transition-transform duration-200'
                style={{
                  color: '#8b949e',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ▼
              </div>
            </button>

            {/* Episodes List */}
            {isExpanded && (
              <div className='p-4' style={{ background: 'rgba(13,17,23,0.6)' }}>
                {loadingSeasons[season.season_number] ? (
                  <div className='flex justify-center py-8'>
                    <Loader />
                  </div>
                ) : seasonDetails[season.season_number] ? (
                  <EpisodeList show={show} season={seasonDetails[season.season_number]} />
                ) : (
                  <div className='text-center py-8' style={{ color: '#8b949e' }}>
                    Failed to load episodes
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SeasonList

// Made with Bob
