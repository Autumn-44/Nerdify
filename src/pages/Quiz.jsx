import { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import GuessTheMovie from '../components/quiz/GuessTheMovie'
import GuessTheActor from '../components/quiz/GuessTheActor'
import OscarTrivia from '../components/quiz/OscarTrivia'

function Quiz() {
  const [selectedMode, setSelectedMode] = useState(null)
  const [totalScore, setTotalScore] = useState(0)

  const gameModes = [
    {
      id: 'movie',
      title: 'Guess the Movie',
      icon: '🎬',
      description: 'Reveal the blurred poster and guess the movie title',
      color: 'from-blue-500 to-purple-500',
      component: GuessTheMovie,
    },
    {
      id: 'actor',
      title: 'Guess the Actor',
      icon: '🎭',
      description: 'Identify actors from their filmography and photos',
      color: 'from-pink-500 to-red-500',
      component: GuessTheActor,
    },
    {
      id: 'oscar',
      title: 'Oscar Trivia',
      icon: '🏆',
      description: 'Test your knowledge of award-winning films',
      color: 'from-yellow-500 to-orange-500',
      component: OscarTrivia,
    },
  ]

  const handleComplete = (score) => {
    setTotalScore(prev => prev + score)
  }

  const resetGame = () => {
    setSelectedMode(null)
    setTotalScore(0)
  }

  if (selectedMode) {
    const mode = gameModes.find(m => m.id === selectedMode)
    const GameComponent = mode.component

    return (
      <MainLayout>
        <div className='py-8 px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h1 className='text-3xl font-black text-white mb-2'>{mode.title}</h1>
                <p className='text-gray-400'>{mode.description}</p>
              </div>
              <button
                onClick={resetGame}
                className='px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors'
              >
                ← Back to Menu
              </button>
            </div>

            <GameComponent onComplete={handleComplete} />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className='py-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-5xl font-black mb-4'>🎮 Movie Quiz</h1>
            <p className='text-xl text-gray-400'>Test your movie knowledge and compete for high scores!</p>
          </div>

          <div className='grid md:grid-cols-3 gap-6 mb-12'>
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className='group relative overflow-hidden rounded-2xl p-8 bg-[#1c1f26] border border-white/10 hover:border-white/30 transition-all hover:scale-105'
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className='relative'>
                  <div className='text-6xl mb-4'>{mode.icon}</div>
                  <h3 className='text-2xl font-bold text-white mb-2'>{mode.title}</h3>
                  <p className='text-gray-400 text-sm'>{mode.description}</p>
                  
                  <div className='mt-6 flex items-center justify-center gap-2 text-green-400 font-semibold'>
                    <span>Play Now</span>
                    <span className='group-hover:translate-x-1 transition-transform'>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {totalScore > 0 && (
            <div className='text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl'>
              <p className='text-gray-400 mb-2'>Total Score</p>
              <p className='text-4xl font-black text-green-400'>{totalScore}</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Quiz

// Made with Bob
