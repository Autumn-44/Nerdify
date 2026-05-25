import { useState, useEffect } from 'react'
import geminiService from '../../services/geminiService'
import Loader from '../common/Loader'

function GeminiQuiz() {
  const [selectedTheme, setSelectedTheme] = useState('general')
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)

  const themes = geminiService.getAvailableThemes()
  const difficulties = geminiService.getDifficultyLevels()

  const startQuiz = async () => {
    setLoading(true)
    setError('')
    setQuizStarted(true)
    setQuestions([])
    setCurrentQuestion(0)
    setScore(0)
    setQuizComplete(false)

    try {
      const generatedQuestions = await geminiService.generateQuiz(
        selectedTheme,
        selectedDifficulty,
        10
      )
      setQuestions(generatedQuestions)
    } catch (err) {
      setError(err.message || 'Failed to generate quiz. Please try again.')
      setQuizStarted(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return // Prevent changing answer after submission
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestartQuiz = () => {
    setQuizStarted(false)
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizComplete(false)
    setError('')
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage === 100) return '🏆 Perfect Score! You\'re a cinema master!'
    if (percentage >= 80) return '🌟 Excellent! You really know your movies!'
    if (percentage >= 60) return '👍 Good job! Solid movie knowledge!'
    if (percentage >= 40) return '📚 Not bad! Keep watching more movies!'
    return '🎬 Keep learning! Every movie fan starts somewhere!'
  }

  if (!quizStarted) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-8 border border-white/10'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-black text-white mb-2'>🤖 AI-Powered Movie Quiz</h2>
            <p className='text-gray-400'>Powered by Google Gemini</p>
          </div>

          {error && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg'>
              <p className='text-red-400 text-sm'>{error}</p>
            </div>
          )}

          {/* Theme Selection */}
          <div className='mb-8'>
            <h3 className='text-lg font-bold text-white mb-4'>Choose a Theme</h3>
            <div className='grid grid-cols-3 md:grid-cols-5 gap-3'>
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    selectedTheme === theme.id
                      ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-2 border-orange-400/50 scale-95'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}>
                  <div className='text-3xl mb-2'>{theme.icon}</div>
                  <div className='text-xs font-semibold text-white'>{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className='mb-8'>
            <h3 className='text-lg font-bold text-white mb-4'>Choose Difficulty</h3>
            <div className='grid grid-cols-3 gap-4'>
              {difficulties.map(diff => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedDifficulty === diff.id
                      ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-2 border-orange-400/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}>
                  <div className='font-bold text-white mb-1'>{diff.name}</div>
                  <div className='text-xs text-gray-400'>{diff.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startQuiz}
            disabled={loading}
            className='w-full py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'>
            {loading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-12 border border-white/10 text-center'>
          <Loader />
          <p className='text-gray-400 mt-4'>Generating your personalized quiz...</p>
        </div>
      </div>
    )
  }

  if (quizComplete) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-8 border border-white/10 text-center'>
          <h2 className='text-4xl font-black text-white mb-4'>Quiz Complete!</h2>
          <div className='text-6xl font-black mb-4' style={{ 
            background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {score}/{questions.length}
          </div>
          <p className='text-xl text-gray-300 mb-8'>{getScoreMessage()}</p>
          
          <div className='flex gap-4 justify-center'>
            <button
              onClick={handleRestartQuiz}
              className='px-6 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all'>
              Choose New Theme
            </button>
            <button
              onClick={startQuiz}
              className='px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all'>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return null
  }

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-8 border border-white/10'>
        {/* Progress */}
        <div className='mb-6'>
          <div className='flex justify-between text-sm text-gray-400 mb-2'>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Score: {score}/{questions.length}</span>
          </div>
          <div className='h-2 bg-white/10 rounded-full overflow-hidden'>
            <div 
              className='h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300'
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h3 className='text-2xl font-bold text-white mb-6'>{question.question}</h3>

        {/* Options */}
        <div className='space-y-3 mb-6'>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === question.correctAnswer
            const showResult = showExplanation

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  showResult
                    ? isCorrectAnswer
                      ? 'bg-green-500/20 border-2 border-green-500/50'
                      : isSelected
                      ? 'bg-red-500/20 border-2 border-red-500/50'
                      : 'bg-white/5 border border-white/10'
                    : isSelected
                    ? 'bg-orange-400/20 border-2 border-orange-400/50'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}>
                <div className='flex items-center gap-3'>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    showResult
                      ? isCorrectAnswer
                        ? 'bg-green-500 text-white'
                        : isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-white/10 text-gray-400'
                      : isSelected
                      ? 'bg-orange-400 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className='text-white font-medium'>{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-xl mb-6 ${
            isCorrect
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <p className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className='text-gray-300 text-sm'>{question.explanation}</p>
          </div>
        )}

        {/* Action Button */}
        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className='w-full py-3 rounded-xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className='w-full py-3 rounded-xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition-all'>
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  )
}

export default GeminiQuiz

// Made with Bob