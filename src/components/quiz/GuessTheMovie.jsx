import { useState, useEffect } from 'react'
import quizService from '../../services/quizService'

function GuessTheMovie({ onComplete }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [cluesRevealed, setCluesRevealed] = useState(1) // Start with 1 clue visible
  const [gameState, setGameState] = useState('playing') // playing, correct, wrong
  const [startTime] = useState(Date.now())
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState([])

  useEffect(() => {
    loadMovie()
  }, [])

  const loadMovie = async () => {
    setLoading(true)
    const movies = await quizService.getRandomMovies(4) // Get 4 movies for options
    if (movies.length >= 4) {
      const correctMovie = movies[0]
      const movieDetails = await quizService.getMovieWithCast(correctMovie.id)
      setMovie(movieDetails)
      
      // Create options from the 4 movies
      const movieOptions = movies.map(m => m.title).sort(() => Math.random() - 0.5)
      setOptions(movieOptions)
    }
    setLoading(false)
  }

  const revealNextClue = () => {
    if (cluesRevealed < 5) {
      setCluesRevealed(prev => prev + 1)
    }
  }

  const selectAnswer = (answer) => {
    if (gameState !== 'playing') return
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === movie.title
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    // Penalty for using more clues
    const cluesPenalty = (cluesRevealed - 1) * 150
    const earnedScore = Math.max(100, quizService.calculateScore(timeElapsed, 0) - cluesPenalty)

    setGameState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(earnedScore)
    }
  }

  const nextMovie = () => {
    if (onComplete) {
      onComplete(score)
    }
    // Reset for next round
    setSelectedAnswer(null)
    setCluesRevealed(1)
    setGameState('playing')
    setScore(0)
    loadMovie()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400'></div>
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

  // Generate clues based on movie data
  const clues = [
    {
      icon: '📅',
      label: 'Release Year',
      value: `Released in ${movie.releaseYear}`,
      revealed: cluesRevealed >= 1
    },
    {
      icon: '🎭',
      label: 'Genre',
      value: movie.genres.length > 0 ? movie.genres.join(', ') : 'Drama',
      revealed: cluesRevealed >= 2
    },
    {
      icon: '🎬',
      label: 'Director',
      value: `Directed by ${movie.director}`,
      revealed: cluesRevealed >= 3
    },
    {
      icon: '⭐',
      label: 'Main Cast',
      value: movie.cast.slice(0, 2).map(c => c.name).join(', '),
      revealed: cluesRevealed >= 4
    },
    {
      icon: '📝',
      label: 'Plot Hint',
      value: movie.overview ? movie.overview.substring(0, 100) + '...' : 'A cinematic masterpiece',
      revealed: cluesRevealed >= 5
    }
  ]

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold mb-2'>🎬 Guess the Movie</h2>
        <p className='text-gray-400'>Use the clues to identify the movie!</p>
      </div>

      {/* Clues Section */}
      <div className='bg-[#1c1f26] rounded-xl p-6 mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-xl font-bold'>Clues ({cluesRevealed}/5)</h3>
          {cluesRevealed < 5 && gameState === 'playing' && (
            <button
              onClick={revealNextClue}
              className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm'
            >
              💡 Reveal Next Clue
            </button>
          )}
        </div>

        <div className='space-y-4'>
          {clues.map((clue, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all ${
                clue.revealed
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className='flex items-start gap-3'>
                <span className='text-2xl'>{clue.icon}</span>
                <div className='flex-1'>
                  <div className='font-semibold text-sm text-gray-400 mb-1'>{clue.label}</div>
                  {clue.revealed ? (
                    <div className='text-white font-medium'>{clue.value}</div>
                  ) : (
                    <div className='text-gray-600'>🔒 Locked</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Options */}
      {gameState === 'playing' && (
        <>
          <div className='mb-6'>
            <h3 className='text-lg font-bold mb-4'>Select the Movie:</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`p-4 rounded-lg border-2 transition-all text-left font-semibold ${
                    selectedAnswer === option
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-[#1c1f26] border-white/10 text-white hover:border-white/30'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className='w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-colors'
          >
            Submit Answer
          </button>

          {/* Stats */}
          <div className='mt-6 flex justify-between text-sm text-gray-400'>
            <span>Clues Revealed: {cluesRevealed}/5</span>
            <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
          </div>
        </>
      )}

      {/* Result Screen */}
      {gameState === 'correct' && (
        <div className='bg-primary-500/10 border-2 border-primary-500 rounded-xl p-8 text-center'>
          <div className='text-6xl mb-4'>🎉</div>
          <h2 className='text-4xl font-black text-white mb-2'>Correct!</h2>
          <p className='text-xl text-primary-400 font-bold mb-6'>+{score} points</p>
          <div className='mb-6'>
            <img
              src={movie.poster}
              alt={movie.title}
              className='w-48 h-auto mx-auto rounded-lg shadow-xl'
            />
          </div>
          <p className='text-gray-300 mb-2'>{movie.title} ({movie.releaseYear})</p>
          <p className='text-sm text-gray-400'>{movie.overview}</p>
          <button
            onClick={nextMovie}
            className='mt-6 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-colors'
          >
            Next Movie →
          </button>
        </div>
      )}

      {gameState === 'wrong' && (
        <div className='bg-red-500/10 border-2 border-red-500 rounded-xl p-8 text-center'>
          <div className='text-6xl mb-4'>❌</div>
          <h2 className='text-4xl font-black text-white mb-2'>Wrong!</h2>
          <p className='text-xl text-white mb-6'>
            It was: <span className='text-red-400 font-bold'>{movie.title}</span>
          </p>
          <div className='mb-6'>
            <img
              src={movie.poster}
              alt={movie.title}
              className='w-48 h-auto mx-auto rounded-lg shadow-xl'
            />
          </div>
          <p className='text-gray-300 mb-2'>{movie.title} ({movie.releaseYear})</p>
          <p className='text-sm text-gray-400'>{movie.overview}</p>
          <button
            onClick={nextMovie}
            className='mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors'
          >
            Try Another →
          </button>
        </div>
      )}
    </div>
  )
}

export default GuessTheMovie

// Made with Bob
