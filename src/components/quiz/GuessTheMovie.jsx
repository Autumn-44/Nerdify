import { useState, useEffect } from 'react'
import quizService from '../../services/quizService'

function GuessTheMovie({ onComplete }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [blurLevel, setBlurLevel] = useState(20)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHints, setShowHints] = useState({ cast: false, director: false, genre: false })
  const [gameState, setGameState] = useState('playing') // playing, correct, wrong
  const [startTime] = useState(Date.now())
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadMovie()
  }, [])

  const loadMovie = async () => {
    setLoading(true)
    const movies = await quizService.getRandomMovies(1)
    if (movies.length > 0) {
      const movieDetails = await quizService.getMovieWithCast(movies[0].id)
      setMovie(movieDetails)
    }
    setLoading(false)
  }

  const revealPoster = () => {
    if (blurLevel > 0) {
      setBlurLevel(Math.max(0, blurLevel - 5))
      setHintsUsed(prev => prev + 0.5)
    }
  }

  const showHint = (hintType) => {
    setShowHints(prev => ({ ...prev, [hintType]: true }))
    setHintsUsed(prev => prev + 1)
  }

  const checkAnswer = () => {
    if (!userAnswer.trim()) return

    const isCorrect = quizService.checkAnswer(userAnswer, movie.title)
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const earnedScore = quizService.calculateScore(timeElapsed, hintsUsed)

    setGameState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(earnedScore)
      setBlurLevel(0)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      checkAnswer()
    }
  }

  const nextMovie = () => {
    if (onComplete) {
      onComplete(score)
    }
    // Reset for next round
    setUserAnswer('')
    setBlurLevel(20)
    setHintsUsed(0)
    setShowHints({ cast: false, director: false, genre: false })
    setGameState('playing')
    setScore(0)
    loadMovie()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400'></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className='text-center py-20'>
        <p className='text-red-400'>Failed to load movie. Please try again.</p>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Movie Poster */}
      <div className='relative mb-8 rounded-xl overflow-hidden' style={{ aspectRatio: '2/3', maxHeight: '500px' }}>
        <img
          src={movie.poster}
          alt='Mystery Movie'
          className='w-full h-full object-cover transition-all duration-500'
          style={{ filter: `blur(${blurLevel}px)` }}
        />
        
        {gameState === 'correct' && (
          <div className='absolute inset-0 bg-green-400/20 backdrop-blur-sm flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>🎉</div>
              <h2 className='text-4xl font-black text-white mb-2'>Correct!</h2>
              <p className='text-2xl text-green-400 font-bold'>+{score} points</p>
            </div>
          </div>
        )}
        
        {gameState === 'wrong' && (
          <div className='absolute inset-0 bg-red-400/20 backdrop-blur-sm flex items-center justify-center'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>❌</div>
              <h2 className='text-4xl font-black text-white mb-2'>Wrong!</h2>
              <p className='text-xl text-white'>It was: <span className='text-red-400 font-bold'>{movie.title}</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      {gameState === 'playing' && (
        <>
          {/* Reveal Button */}
          <div className='mb-6 text-center'>
            <button
              onClick={revealPoster}
              disabled={blurLevel === 0}
              className='px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors'
            >
              👁️ Reveal More ({blurLevel > 0 ? `${blurLevel}% blurred` : 'Fully Revealed'})
            </button>
          </div>

          {/* Hints */}
          <div className='grid grid-cols-3 gap-4 mb-6'>
            <button
              onClick={() => showHint('genre')}
              disabled={showHints.genre}
              className='p-4 bg-[#1c1f26] hover:bg-[#252930] disabled:bg-gray-800 border border-white/10 rounded-lg transition-colors'
            >
              <div className='text-2xl mb-2'>🎭</div>
              <div className='text-sm font-semibold text-white'>Genre</div>
              {showHints.genre && (
                <div className='mt-2 text-green-400 text-xs'>{movie.genres.join(', ')}</div>
              )}
            </button>

            <button
              onClick={() => showHint('director')}
              disabled={showHints.director}
              className='p-4 bg-[#1c1f26] hover:bg-[#252930] disabled:bg-gray-800 border border-white/10 rounded-lg transition-colors'
            >
              <div className='text-2xl mb-2'>🎬</div>
              <div className='text-sm font-semibold text-white'>Director</div>
              {showHints.director && (
                <div className='mt-2 text-green-400 text-xs'>{movie.director}</div>
              )}
            </button>

            <button
              onClick={() => showHint('cast')}
              disabled={showHints.cast}
              className='p-4 bg-[#1c1f26] hover:bg-[#252930] disabled:bg-gray-800 border border-white/10 rounded-lg transition-colors'
            >
              <div className='text-2xl mb-2'>⭐</div>
              <div className='text-sm font-semibold text-white'>Cast</div>
              {showHints.cast && (
                <div className='mt-2 text-green-400 text-xs'>
                  {movie.cast.slice(0, 3).map(c => c.name).join(', ')}
                </div>
              )}
            </button>
          </div>

          {/* Answer Input */}
          <div className='mb-6'>
            <input
              type='text'
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Type the movie title...'
              className='w-full bg-[#1c1f26] border border-white/10 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-600 outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all'
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
            className='w-full py-4 bg-green-400 hover:bg-green-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-colors'
          >
            Submit Answer
          </button>

          {/* Stats */}
          <div className='mt-6 flex justify-between text-sm text-gray-400'>
            <span>Hints Used: {hintsUsed}</span>
            <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
          </div>
        </>
      )}

      {/* Next Button */}
      {gameState !== 'playing' && (
        <button
          onClick={nextMovie}
          className='w-full py-4 bg-green-400 hover:bg-green-300 text-black font-bold text-lg rounded-xl transition-colors'
        >
          Next Movie →
        </button>
      )}
    </div>
  )
}

export default GuessTheMovie

// Made with Bob