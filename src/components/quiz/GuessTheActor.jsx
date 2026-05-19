import { useState, useEffect } from 'react'
import quizService from '../../services/quizService'

function GuessTheActor({ onComplete }) {
  const [actor, setActor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userAnswer, setUserAnswer] = useState('')
  const [revealedFacts, setRevealedFacts] = useState(1)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [startTime] = useState(Date.now())
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadActor()
  }, [])

  const loadActor = async () => {
    setLoading(true)
    const actors = await quizService.getRandomActors(1)
    if (actors.length > 0) {
      const actorDetails = await quizService.getActorWithFilmography(actors[0].id)
      setActor(actorDetails)
    }
    setLoading(false)
  }

  const generateFacts = () => {
    if (!actor) return []
    
    const facts = []
    
    // Fact 1: Known for department
    facts.push({
      icon: '🎭',
      text: `This person is known for ${actor.knownFor.toLowerCase()}`
    })
    
    // Fact 2: Top movies
    if (actor.movies.length > 0) {
      const topMovies = actor.movies.slice(0, 3).map(m => m.title).join(', ')
      facts.push({
        icon: '🎬',
        text: `Appeared in: ${topMovies}`
      })
    }
    
    // Fact 3: Birthplace
    if (actor.placeOfBirth) {
      facts.push({
        icon: '🌍',
        text: `Born in ${actor.placeOfBirth}`
      })
    }
    
    // Fact 4: More movies
    if (actor.movies.length > 3) {
      const moreMovies = actor.movies.slice(3, 6).map(m => m.title).join(', ')
      facts.push({
        icon: '🎥',
        text: `Also starred in: ${moreMovies}`
      })
    }
    
    // Fact 5: Character roles
    if (actor.movies.length > 0) {
      const roles = actor.movies.slice(0, 2).map(m => `${m.character} in ${m.title}`).join(', ')
      facts.push({
        icon: '🎪',
        text: `Played: ${roles}`
      })
    }
    
    // Fact 6: Birthday
    if (actor.birthday) {
      const year = actor.birthday.split('-')[0]
      facts.push({
        icon: '🎂',
        text: `Born in ${year}`
      })
    }
    
    return facts
  }

  const facts = generateFacts()

  const revealMoreFacts = () => {
    if (revealedFacts < facts.length) {
      setRevealedFacts(prev => Math.min(prev + 1, facts.length))
      setHintsUsed(prev => prev + 1)
    }
  }

  const checkAnswer = (skipAnswer = false) => {
    const isCorrect = skipAnswer ? false : quizService.checkAnswer(userAnswer, actor.name)
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const earnedScore = skipAnswer ? 0 : quizService.calculateScore(timeElapsed, hintsUsed)

    setGameState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(earnedScore)
    }
    setRevealedFacts(facts.length) // Show all facts
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      checkAnswer()
    }
  }

  const nextActor = () => {
    if (onComplete) {
      onComplete(score)
    }
    setUserAnswer('')
    setRevealedFacts(1)
    setHintsUsed(0)
    setGameState('playing')
    setScore(0)
    loadActor()
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400'></div>
      </div>
    )
  }

  if (!actor || facts.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-red-400'>Failed to load actor. Please try again.</p>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Facts Display */}
      <div className='bg-[#1c1f26] rounded-xl p-8 border border-white/10 mb-8'>
        <h2 className='text-2xl font-bold text-white mb-6 text-center'>
          🕵️ Who is this person?
        </h2>
        
        <div className='space-y-4'>
          {facts.slice(0, revealedFacts).map((fact, idx) => (
            <div
              key={idx}
              className='p-4 bg-[#252930] rounded-lg border border-white/5 animate-fadeIn flex items-start gap-4'
            >
              <div className='text-3xl'>{fact.icon}</div>
              <div className='flex-1'>
                <p className='text-white text-lg'>{fact.text}</p>
              </div>
            </div>
          ))}
        </div>

        {gameState === 'playing' && revealedFacts < facts.length && (
          <button
            onClick={revealMoreFacts}
            className='mt-6 w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors'
          >
            💡 Reveal Another Fact ({facts.length - revealedFacts} remaining)
          </button>
        )}
      </div>

      {/* Result Display */}
      {gameState !== 'playing' && (
        <div className='mb-8'>
          {gameState === 'correct' ? (
            <div className='bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center'>
              <div className='text-6xl mb-4'>🎉</div>
              <h2 className='text-3xl font-black text-white mb-2'>Correct!</h2>
              <p className='text-xl text-green-400 font-bold mb-4'>+{score} points</p>
              <div className='flex justify-center'>
                <img
                  src={actor.profileImage}
                  alt={actor.name}
                  className='w-48 h-48 object-cover rounded-lg'
                />
              </div>
              <p className='text-2xl text-white font-bold mt-4'>{actor.name}</p>
            </div>
          ) : (
            <div className='bg-orange-500/10 border border-orange-500/30 rounded-xl p-8 text-center'>
              <div className='text-6xl mb-4'>🤔</div>
              <h2 className='text-3xl font-black text-white mb-2'>It was...</h2>
              <div className='flex justify-center mb-4'>
                <img
                  src={actor.profileImage}
                  alt={actor.name}
                  className='w-48 h-48 object-cover rounded-lg'
                />
              </div>
              <p className='text-2xl text-orange-400 font-bold'>{actor.name}</p>
              {actor.biography && (
                <p className='text-gray-400 text-sm mt-4 max-w-2xl mx-auto'>
                  {actor.biography.slice(0, 200)}...
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Answer Section */}
      {gameState === 'playing' && (
        <div className='space-y-4'>
          <input
            type='text'
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type the actor/actress name...'
            className='w-full bg-[#1c1f26] border border-white/10 rounded-xl px-6 py-4 text-white text-lg placeholder-gray-600 outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all'
            autoFocus
          />

          <div className='grid grid-cols-2 gap-4'>
            <button
              onClick={() => checkAnswer(false)}
              disabled={!userAnswer.trim()}
              className='py-4 bg-green-400 hover:bg-green-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-colors'
            >
              Submit Answer
            </button>
            
            <button
              onClick={() => checkAnswer(true)}
              className='py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-colors'
            >
              🤷 I Don't Know
            </button>
          </div>

          <div className='flex justify-between text-sm text-gray-400 pt-2'>
            <span>Facts Revealed: {revealedFacts}/{facts.length}</span>
            <span>Time: {Math.floor((Date.now() - startTime) / 1000)}s</span>
          </div>
        </div>
      )}

      {/* Next Button */}
      {gameState !== 'playing' && (
        <button
          onClick={nextActor}
          className='w-full py-4 bg-green-400 hover:bg-green-300 text-black font-bold text-lg rounded-xl transition-colors'
        >
          Next Actor →
        </button>
      )}
    </div>
  )
}

export default GuessTheActor

// Made with Bob