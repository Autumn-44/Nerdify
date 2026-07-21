import { useState, useEffect } from 'react'

// Hard Oscar trivia questions - Updated with comprehensive set
const OSCAR_QUESTIONS = [
  {
    question: "Which film won Best Picture at the 2020 Academy Awards, becoming the first non-English language film to win this category?",
    options: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"],
    correctAnswer: "Parasite",
    difficulty: "medium"
  },
  {
    question: "Who is the only person to have won an Oscar for acting, writing, and directing?",
    options: ["Warren Beatty", "Clint Eastwood", "Woody Allen", "Robert Redford"],
    correctAnswer: "Warren Beatty",
    difficulty: "hard"
  },
  {
    question: "Which actor has won the most Academy Awards for acting?",
    options: ["Katharine Hepburn", "Meryl Streep", "Jack Nicholson", "Daniel Day-Lewis"],
    correctAnswer: "Katharine Hepburn",
    difficulty: "medium"
  },
  {
    question: "What was the first film to win Best Picture at the Academy Awards?",
    options: ["Wings", "The Jazz Singer", "Sunrise", "7th Heaven"],
    correctAnswer: "Wings",
    difficulty: "hard"
  },
  {
    question: "Which film holds the record for most Oscar wins in a single year with 11 awards?",
    options: ["Ben-Hur", "Titanic", "The Lord of the Rings: The Return of the King", "All of the above"],
    correctAnswer: "All of the above",
    difficulty: "hard"
  },
  {
    question: "Who was the youngest person ever to win an Academy Award for acting?",
    options: ["Tatum O'Neal", "Anna Paquin", "Shirley Temple", "Haley Joel Osment"],
    correctAnswer: "Tatum O'Neal",
    difficulty: "hard"
  },
  {
    question: "Which director has won the most Best Director Oscars?",
    options: ["John Ford", "Steven Spielberg", "William Wyler", "Frank Capra"],
    correctAnswer: "John Ford",
    difficulty: "hard"
  },
  {
    question: "What film won Best Picture in 2023?",
    options: ["Everything Everywhere All at Once", "The Fabelmans", "Top Gun: Maverick", "Avatar: The Way of Water"],
    correctAnswer: "Everything Everywhere All at Once",
    difficulty: "easy"
  },
  {
    question: "Which actor refused to accept their Best Actor Oscar in 1973?",
    options: ["Marlon Brando", "George C. Scott", "Peter O'Toole", "Richard Burton"],
    correctAnswer: "Marlon Brando",
    difficulty: "medium"
  },
  {
    question: "What is the only horror film to win Best Picture?",
    options: ["The Silence of the Lambs", "The Exorcist", "Psycho", "Jaws"],
    correctAnswer: "The Silence of the Lambs",
    difficulty: "medium"
  },
  {
    question: "Which film won Best Picture in 2021?",
    options: ["Nomadland", "The Trial of the Chicago 7", "Mank", "Promising Young Woman"],
    correctAnswer: "Nomadland",
    difficulty: "medium"
  },
  {
    question: "Who is the oldest person to win an acting Oscar?",
    options: ["Anthony Hopkins", "Christopher Plummer", "Jessica Tandy", "Katharine Hepburn"],
    correctAnswer: "Anthony Hopkins",
    difficulty: "hard"
  },
  {
    question: "Which film won Best Picture in 2022?",
    options: ["CODA", "The Power of the Dog", "Belfast", "West Side Story"],
    correctAnswer: "CODA",
    difficulty: "easy"
  },
  {
    question: "How many times has Meryl Streep been nominated for an Academy Award?",
    options: ["21 times", "17 times", "25 times", "19 times"],
    correctAnswer: "21 times",
    difficulty: "hard"
  },
  {
    question: "Which film won Best Picture in 2024?",
    options: ["Oppenheimer", "Killers of the Flower Moon", "Poor Things", "The Holdovers"],
    correctAnswer: "Oppenheimer",
    difficulty: "easy"
  },
  {
    question: "Who was the first African American to win an Academy Award for Best Actor?",
    options: ["Sidney Poitier", "Denzel Washington", "Morgan Freeman", "Jamie Foxx"],
    correctAnswer: "Sidney Poitier",
    difficulty: "medium"
  },
  {
    question: "Which animated film was the first to be nominated for Best Picture?",
    options: ["Beauty and the Beast", "Toy Story", "The Lion King", "Finding Nemo"],
    correctAnswer: "Beauty and the Beast",
    difficulty: "medium"
  },
  {
    question: "What film won Best Picture in 2019?",
    options: ["Green Book", "Roma", "The Favourite", "Black Panther"],
    correctAnswer: "Green Book",
    difficulty: "easy"
  },
  {
    question: "Which actor has been nominated for the most Oscars without ever winning?",
    options: ["Peter O'Toole", "Glenn Close", "Amy Adams", "Richard Burton"],
    correctAnswer: "Peter O'Toole",
    difficulty: "hard"
  },
  {
    question: "What was the first sequel to win Best Picture?",
    options: ["The Godfather Part II", "The Lord of the Rings: The Return of the King", "The French Connection II", "Rocky II"],
    correctAnswer: "The Godfather Part II",
    difficulty: "medium"
  },
  {
    question: "Which film won Best Picture in 2018?",
    options: ["The Shape of Water", "Three Billboards Outside Ebbing, Missouri", "Get Out", "Dunkirk"],
    correctAnswer: "The Shape of Water",
    difficulty: "medium"
  },
  {
    question: "Who won Best Actor for playing the Joker?",
    options: ["Joaquin Phoenix", "Heath Ledger", "Jack Nicholson", "Jared Leto"],
    correctAnswer: "Joaquin Phoenix",
    difficulty: "easy"
  },
  {
    question: "Which film won Best Picture in 2017?",
    options: ["Moonlight", "La La Land", "Manchester by the Sea", "Arrival"],
    correctAnswer: "Moonlight",
    difficulty: "medium"
  },
  {
    question: "How many Oscars did 'Titanic' win?",
    options: ["11", "10", "12", "9"],
    correctAnswer: "11",
    difficulty: "medium"
  },
  {
    question: "Which actress has won the most Best Actress Oscars?",
    options: ["Katharine Hepburn", "Meryl Streep", "Bette Davis", "Ingrid Bergman"],
    correctAnswer: "Katharine Hepburn",
    difficulty: "medium"
  }
]

function OscarTriviaHard({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [questions, setQuestions] = useState([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(true)

  useEffect(() => {
    // Shuffle and select 10 random questions on mount
    const shuffled = [...OSCAR_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
  }, [])

  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout()
    }
  }, [timeLeft, timerActive, showResult])

  const handleTimeout = () => {
    setShowResult(true)
    setIsCorrect(false)
    setTimerActive(false)
  }

  const handleAnswer = (answer) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    setTimerActive(false)
    const correct = answer === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      const timeBonus = Math.floor(timeLeft / 3)
      setScore(score + 100 + timeBonus)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(false)
      setTimeLeft(30)
      setTimerActive(true)
    } else {
      setGameOver(true)
      if (onComplete) {
        onComplete(score)
      }
    }
  }

  const restartQuiz = () => {
    const shuffled = [...OSCAR_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
    setGameOver(false)
    setTimeLeft(30)
    setTimerActive(true)
  }

  if (questions.length === 0) {
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400'></div>
      </div>
    )
  }

  if (gameOver) {
    const percentage = (score / 1000) * 100
    let message = ''
    let emoji = ''
    
    if (percentage >= 80) {
      message = 'Oscar Expert! You know your cinema history!'
      emoji = '🏆'
    } else if (percentage >= 60) {
      message = 'Great job! You\'re a true film buff!'
      emoji = '⭐'
    } else if (percentage >= 40) {
      message = 'Not bad! Keep watching more classics!'
      emoji = '🎬'
    } else {
      message = 'Time to binge some Oscar winners!'
      emoji = '📽️'
    }

    return (
      <div className='max-w-2xl mx-auto text-center py-12'>
        <div className='text-8xl mb-6'>{emoji}</div>
        <h2 className='text-4xl font-black text-white mb-4'>Quiz Complete!</h2>
        <p className='text-xl text-gray-400 mb-8'>{message}</p>
        
        <div className='bg-gradient-to-br from-orange-400/10 to-orange-500/10 rounded-2xl p-8 border border-orange-400/20 mb-8'>
          <p className='text-gray-400 mb-2'>Final Score</p>
          <p className='text-6xl font-black text-orange-400 mb-4'>{score}</p>
          <p className='text-gray-400'>
            {questions.filter((_, idx) => idx < currentQuestion + 1).length} / {questions.length} questions answered
          </p>
        </div>

        <button
          onClick={restartQuiz}
          className='px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl'
          style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
          Play Again
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className='max-w-3xl mx-auto'>
      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-semibold text-gray-400'>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className='text-sm font-semibold text-gray-400'>
            Score: <span className='text-orange-400'>{score}</span>
          </span>
        </div>
        <div className='w-full h-2 bg-white/10 rounded-full overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className='mb-6 flex justify-center'>
        <div className={`text-4xl font-black tabular-nums ${
          timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-orange-400'
        }`}>
          {timeLeft}s
        </div>
      </div>

      {/* Question Card */}
      <div className='bg-gradient-to-br from-[#1a1f2e] to-[#161b22] rounded-2xl p-8 border border-white/10 mb-6'>
        <div className='flex items-start gap-3 mb-6'>
          <span className='text-3xl'>🏆</span>
          <h3 className='text-2xl font-bold text-white leading-tight flex-1'>
            {question.question}
          </h3>
        </div>

        <div className='grid gap-3'>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = option === question.correctAnswer
            const showCorrect = showResult && isCorrectOption
            const showWrong = showResult && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-xl text-left font-semibold transition-all duration-200 ${
                  showCorrect
                    ? 'bg-primary-400/20 border-2 border-primary-400 text-primary-400'
                    : showWrong
                    ? 'bg-red-400/20 border-2 border-red-400 text-red-400'
                    : isSelected
                    ? 'bg-orange-400/20 border-2 border-orange-400 text-orange-400'
                    : 'bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className='flex items-center justify-between'>
                  <span>{option}</span>
                  {showCorrect && <span className='text-2xl'>✓</span>}
                  {showWrong && <span className='text-2xl'>✗</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Result Message */}
      {showResult && (
        <div className={`p-6 rounded-xl mb-6 ${
          isCorrect
            ? 'bg-primary-400/10 border border-primary-400/30'
            : 'bg-red-400/10 border border-red-400/30'
        }`}>
          <p className={`text-xl font-bold mb-2 ${
            isCorrect ? 'text-primary-400' : 'text-red-400'
          }`}>
            {isCorrect ? '🎉 Correct!' : timeLeft === 0 ? '⏰ Time\'s Up!' : '❌ Incorrect'}
          </p>
          {!isCorrect && (
            <p className='text-gray-300'>
              The correct answer is: <span className='font-bold text-white'>{question.correctAnswer}</span>
            </p>
          )}
          {isCorrect && timeLeft > 0 && (
            <p className='text-gray-300'>
              Time bonus: +{Math.floor(timeLeft / 3)} points
            </p>
          )}
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNext}
          className='w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl'
          style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', color: '#0d1117' }}>
          {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </div>
  )
}

export default OscarTriviaHard

// Made with Bob
