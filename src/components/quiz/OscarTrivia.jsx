import { useState, useEffect } from 'react'
import quizService from '../../services/quizService'

function OscarTrivia({ onComplete }) {
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [gameState, setGameState] = useState('playing')
  const [startTime] = useState(Date.now())
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadQuestion()
  }, [])

  const loadQuestion = async () => {
    setLoading(true)
    const newQuestion = await quizService.generateOscarQuestion()
    setQuestion(newQuestion)
    setLoading(false)
  }

  const selectAnswer = (answer) => {
    if (gameState !== 'playing') return
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === question.correctAnswer
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const earnedScore = quizService.calculateScore(timeElapsed, 0, 0)

    setGameState(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setScore(earnedScore)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    if (onComplete) {
      onComplete(score)
    }
    setSelectedAnswer(null)
    setGameState('playing')
    setScore(0)
    loadQuestion()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400'></div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className='text-center py-20'>
        <p className='text-red-400'>Failed to load question. Please try again.</p>
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto'>
      {/* Streak Badge */}
      {streak > 0 && (
        <div className='mb-6 text-center'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full'>
            <span className='text-2xl'>🔥</span>
            <span className='text-orange-400 font-bold'>{streak} Streak!</span>
          </div>
        </div>
      )}

      {/* Movie Poster */}
      {question.poster && (
        <div className='mb-8 flex justify-center'>
          <div className='relative w-64 rounded-xl overflow-hidden shadow-2xl'>
            <img
              src={question.poster}
              alt='Movie Poster'
              className='w-full h-auto'
            />
            {question.rating && (
              <div className='absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg'>
                <span className='text-yellow-400 font-bold'>⭐ {question.rating}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question */}
      <div className='bg-[#1c1f26] rounded-xl p-8 border border-white/10 mb-6'>
        <div className='flex items-start gap-3 mb-6'>
          <div className='text-3xl'>🏆</div>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold text-white mb-2'>{question.question}</h2>
            {question.hint && (
              <p className='text-gray-400 text-sm'>{question.hint}</p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className='space-y-3'>
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === question.correctAnswer
            const showResult = gameState !== 'playing'

            let buttonClass = 'w-full p-4 rounded-lg border-2 transition-all text-left font-semibold '
            
            if (showResult) {
              if (isCorrect) {
                buttonClass += 'bg-green-500/20 border-green-500 text-green-400'
              } else if (isSelected && !isCorrect) {
                buttonClass += 'bg-red-500/20 border-red-500 text-red-400'
              } else {
                buttonClass += 'bg-[#252930] border-white/10 text-gray-400'
              }
            } else {
              if (isSelected) {
                buttonClass += 'bg-green-400/20 border-green-400 text-green-400'
              } else {
                buttonClass += 'bg-[#252930] border-white/10 text-white hover:border-green-400/50 hover:bg-green-400/10'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => selectAnswer(option)}
                disabled={gameState !== 'playing'}
                className={buttonClass}
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold'>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                  {showResult && isCorrect && <span className='ml-auto text-2xl'>✓</span>}
                  {showResult && isSelected && !isCorrect && <span className='ml-auto text-2xl'>✗</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Result Message */}
      {gameState === 'correct' && (
        <div className='bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6 text-center'>
          <div className='text-5xl mb-3'>🎉</div>
          <h3 className='text-2xl font-bold text-green-400 mb-2'>Correct!</h3>
          <p className='text-white text-lg mb-2'>You earned <span className='font-bold text-green-400'>{score} points</span></p>
          {question.year && (
            <p className='text-gray-400 text-sm'>Released in {question.year}</p>
          )}
        </div>
      )}

      {gameState === 'wrong' && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6 text-center'>
          <div className='text-5xl mb-3'>😔</div>
          <h3 className='text-2xl font-bold text-red-400 mb-2'>Wrong!</h3>
          <p className='text-white text-lg'>
            The correct answer was: <span className='font-bold text-green-400'>{question.correctAnswer}</span>
          </p>
          {question.year && (
            <p className='text-gray-400 text-sm mt-2'>Released in {question.year}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {gameState === 'playing' ? (
        <div className='space-y-3'>
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer}
            className='w-full py-4 bg-green-400 hover:bg-green-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-colors'
          >
            Submit Answer
          </button>
          <div className='text-center text-sm text-gray-400'>
            Time: {Math.floor((Date.now() - startTime) / 1000)}s
          </div>
        </div>
      ) : (
        <button
          onClick={nextQuestion}
          className='w-full py-4 bg-green-400 hover:bg-green-300 text-black font-bold text-lg rounded-xl transition-colors'
        >
          Next Question →
        </button>
      )}
    </div>
  )
}

export default OscarTrivia

// Made with Bob