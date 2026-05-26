import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import quizService from '../../services/quizService'

/**
 * OscarTrivia Component
 * 
 * A quiz component for Oscar-related movie trivia questions.
 * Features include:
 * - Dynamic question loading
 * - Score tracking with time-based bonuses
 * - Streak tracking for consecutive correct answers
 * - Visual feedback for correct/incorrect answers
 * 
 * @param {Object} props
 * @param {Function} props.onComplete - Callback when quiz completes with score
 * @param {number} [props.maxQuestions] - Maximum number of questions (optional)
 * @param {Function} [props.onError] - Error callback (optional)
 */
function OscarTrivia({ onComplete, maxQuestions, onError }) {
  // State management
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [gameState, setGameState] = useState('playing') // 'playing' | 'correct' | 'wrong'
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  
  // Use ref for startTime to avoid re-renders and maintain accurate timing
  const startTimeRef = useRef(Date.now())
  const mountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  /**
   * Load a new question from the quiz service
   * Includes error handling and loading state management
   */
  const loadQuestion = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const newQuestion = await quizService.generateOscarQuestion()
      
      if (!mountedRef.current) return
      
      if (!newQuestion) {
        throw new Error('Failed to generate question')
      }
      
      setQuestion(newQuestion)
      startTimeRef.current = Date.now()
    } catch (err) {
      console.error('Error loading question:', err)
      
      if (!mountedRef.current) return
      
      setError(err.message || 'Failed to load question')
      
      // Call error callback if provided
      if (onError) {
        onError(err)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [onError])

  // Load initial question on mount
  useEffect(() => {
    loadQuestion()
  }, [loadQuestion])

  /**
   * Handle answer selection
   * Prevents selection when not in playing state
   */
  const selectAnswer = useCallback((answer) => {
    if (gameState !== 'playing') return
    setSelectedAnswer(answer)
  }, [gameState])

  /**
   * Calculate elapsed time in seconds
   */
  const getElapsedTime = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000)
  }, [])

  /**
   * Submit the selected answer and calculate score
   * Updates game state and streak based on correctness
   */
  const submitAnswer = useCallback(() => {
    if (!selectedAnswer || !question) return

    const isCorrect = selectedAnswer === question.correctAnswer
    const timeElapsed = getElapsedTime()
    const earnedScore = quizService.calculateScore(timeElapsed, 0, 0)

    setGameState(isCorrect ? 'correct' : 'wrong')
    
    if (isCorrect) {
      setScore(earnedScore)
      setStreak(prev => prev + 1)
      setTotalScore(prev => prev + earnedScore)
    } else {
      setStreak(0)
    }
    
    setQuestionCount(prev => prev + 1)
  }, [selectedAnswer, question, getElapsedTime])

  /**
   * Move to next question or complete quiz
   * Resets state for new question
   */
  const nextQuestion = useCallback(() => {
    // Check if max questions reached
    if (maxQuestions && questionCount >= maxQuestions) {
      if (onComplete) {
        onComplete(totalScore)
      }
      return
    }

    // Call onComplete with current score before loading next question
    if (onComplete && gameState === 'correct') {
      onComplete(score)
    }
    
    // Reset state for next question
    setSelectedAnswer(null)
    setGameState('playing')
    setScore(0)
    loadQuestion()
  }, [maxQuestions, questionCount, totalScore, onComplete, gameState, score, loadQuestion])

  /**
   * Retry loading question on error
   */
  const retryLoadQuestion = useCallback(() => {
    setError(null)
    loadQuestion()
  }, [loadQuestion])

  /**
   * Memoized button class calculation for options
   * Improves performance by avoiding recalculation on every render
   */
  const getOptionButtonClass = useCallback((option) => {
    const isSelected = selectedAnswer === option
    const isCorrect = option === question?.correctAnswer
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

    return buttonClass
  }, [selectedAnswer, question, gameState])

  /**
   * Memoized elapsed time display
   * Updates every second for real-time display
   */
  const [currentTime, setCurrentTime] = useState(0)
  
  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setCurrentTime(getElapsedTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState, getElapsedTime])

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center py-20' role='status' aria-live='polite'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400' aria-label='Loading question'></div>
      </div>
    )
  }

  // Error state with retry option
  if (error || !question) {
    return (
      <div className='text-center py-20' role='alert'>
        <div className='text-5xl mb-4'>⚠️</div>
        <p className='text-red-400 mb-4'>{error || 'Failed to load question. Please try again.'}</p>
        <button
          onClick={retryLoadQuestion}
          className='px-6 py-3 bg-green-400 hover:bg-green-300 text-black font-bold rounded-xl transition-colors'
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className='max-w-3xl mx-auto'>
      {/* Progress indicator */}
      {maxQuestions && (
        <div className='mb-4 text-center'>
          <p className='text-gray-400 text-sm'>
            Question {questionCount + 1} of {maxQuestions} • Total Score: {totalScore}
          </p>
        </div>
      )}

      {/* Streak Badge */}
      {streak > 0 && (
        <div className='mb-6 text-center' role='status' aria-live='polite'>
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full'>
            <span className='text-2xl' aria-hidden='true'>🔥</span>
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
              alt={`Movie poster for ${question.correctAnswer}`}
              className='w-full h-auto'
              loading='lazy'
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            {question.rating && (
              <div className='absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg'>
                <span className='text-yellow-400 font-bold' aria-label={`Rating: ${question.rating} out of 10`}>
                  ⭐ {question.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question */}
      <div className='bg-[#1c1f26] rounded-xl p-8 border border-white/10 mb-6'>
        <div className='flex items-start gap-3 mb-6'>
          <div className='text-3xl' aria-hidden='true'>🏆</div>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold text-white mb-2'>{question.question}</h2>
            {question.hint && (
              <p className='text-gray-400 text-sm'>💡 {question.hint}</p>
            )}
          </div>
        </div>

        {/* Options */}
        <div className='space-y-3' role='radiogroup' aria-label='Answer options'>
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === question.correctAnswer
            const showResult = gameState !== 'playing'

            return (
              <button
                key={`${option}-${idx}`}
                onClick={() => selectAnswer(option)}
                disabled={gameState !== 'playing'}
                className={getOptionButtonClass(option)}
                role='radio'
                aria-checked={isSelected}
                aria-label={`Option ${String.fromCharCode(65 + idx)}: ${option}`}
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold flex-shrink-0'>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className='flex-1'>{option}</span>
                  {showResult && isCorrect && <span className='ml-auto text-2xl' aria-label='Correct'>✓</span>}
                  {showResult && isSelected && !isCorrect && <span className='ml-auto text-2xl' aria-label='Incorrect'>✗</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Result Message */}
      {gameState === 'correct' && (
        <div className='bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6 text-center' role='alert' aria-live='assertive'>
          <div className='text-5xl mb-3' aria-hidden='true'>🎉</div>
          <h3 className='text-2xl font-bold text-green-400 mb-2'>Correct!</h3>
          <p className='text-white text-lg mb-2'>
            You earned <span className='font-bold text-green-400'>{score} points</span>
          </p>
          {question.year && (
            <p className='text-gray-400 text-sm'>Released in {question.year}</p>
          )}
        </div>
      )}

      {gameState === 'wrong' && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6 text-center' role='alert' aria-live='assertive'>
          <div className='text-5xl mb-3' aria-hidden='true'>😔</div>
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
            aria-label='Submit your answer'
          >
            Submit Answer
          </button>
          <div className='text-center text-sm text-gray-400' role='timer' aria-live='polite'>
            Time: {currentTime}s
          </div>
        </div>
      ) : (
        <button
          onClick={nextQuestion}
          className='w-full py-4 bg-green-400 hover:bg-green-300 text-black font-bold text-lg rounded-xl transition-colors'
          aria-label='Continue to next question'
        >
          {maxQuestions && questionCount >= maxQuestions - 1 ? 'Finish Quiz' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

// PropTypes for type checking
OscarTrivia.propTypes = {
  onComplete: PropTypes.func,
  maxQuestions: PropTypes.number,
  onError: PropTypes.func,
}

// Default props
OscarTrivia.defaultProps = {
  onComplete: null,
  maxQuestions: null,
  onError: null,
}

export default OscarTrivia

// Made with Bob
