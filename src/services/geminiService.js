const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

class GeminiService {
  async generateQuiz(theme = 'general', difficulty = 'medium', questionCount = 10) {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file')
    }

    const prompt = this.buildQuizPrompt(theme, difficulty, questionCount)

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Gemini API Error:', errorData)
        throw new Error(`Gemini API error (${response.status}): ${errorData.error?.message || response.statusText}. Please check your API key at https://makersuite.google.com/app/apikey`)
      }

      const data = await response.json()
      const generatedText = data.candidates[0].content.parts[0].text
      
      // Parse the JSON response from Gemini
      const questions = this.parseQuizResponse(generatedText)
      return questions

    } catch (error) {
      console.error('Error generating quiz:', error)
      throw error
    }
  }

  buildQuizPrompt(theme, difficulty, questionCount) {
    const themes = {
      general: 'general movie knowledge covering all genres and eras',
      '80s': '1980s movies',
      '90s': '1990s movies',
      '2000s': '2000s movies',
      horror: 'horror movies',
      scifi: 'science fiction movies',
      comedy: 'comedy movies',
      action: 'action movies',
      drama: 'drama movies',
      animated: 'animated movies',
      superhero: 'superhero movies',
      classic: 'classic movies (pre-1980)',
      directors: 'famous movie directors',
      actors: 'famous actors and actresses',
      oscars: 'Oscar-winning movies and performances'
    }

    const themeDescription = themes[theme] || themes.general

    return `Generate ${questionCount} multiple-choice movie trivia questions about ${themeDescription}.
Difficulty level: ${difficulty}

Requirements:
1. Each question must have exactly 4 options (A, B, C, D)
2. Only ONE option should be correct
3. Questions should be interesting and engaging
4. Include a mix of question types (plot, cast, year, director, quotes, etc.)
5. For ${difficulty} difficulty:
   - easy: Well-known movies and obvious facts
   - medium: Moderately challenging, requires some movie knowledge
   - hard: Obscure facts, deep cuts, expert-level knowledge

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks, just raw JSON):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the answer"
  }
]

The correctAnswer should be the index (0-3) of the correct option in the options array.`
  }

  parseQuizResponse(text) {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim()
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '')
      }
      
      const questions = JSON.parse(cleanText)
      
      // Validate the structure
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array')
      }

      questions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
            typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
          throw new Error(`Invalid question structure at index ${index}`)
        }
      })

      return questions
    } catch (error) {
      console.error('Error parsing quiz response:', error)
      console.error('Raw response:', text)
      throw new Error('Failed to parse quiz questions. Please try again.')
    }
  }

  // Get available themes
  getAvailableThemes() {
    return [
      { id: 'general', name: 'General Movies', icon: '🎬' },
      { id: '80s', name: '80s Movies', icon: '📼' },
      { id: '90s', name: '90s Movies', icon: '💿' },
      { id: '2000s', name: '2000s Movies', icon: '📀' },
      { id: 'horror', name: 'Horror', icon: '👻' },
      { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
      { id: 'comedy', name: 'Comedy', icon: '😂' },
      { id: 'action', name: 'Action', icon: '💥' },
      { id: 'drama', name: 'Drama', icon: '🎭' },
      { id: 'animated', name: 'Animated', icon: '🎨' },
      { id: 'superhero', name: 'Superhero', icon: '🦸' },
      { id: 'classic', name: 'Classic Films', icon: '🎞️' },
      { id: 'directors', name: 'Directors', icon: '🎥' },
      { id: 'actors', name: 'Actors', icon: '⭐' },
      { id: 'oscars', name: 'Oscars', icon: '🏆' }
    ]
  }

  // Get difficulty levels
  getDifficultyLevels() {
    return [
      { id: 'easy', name: 'Easy', description: 'For casual movie fans' },
      { id: 'medium', name: 'Medium', description: 'For movie enthusiasts' },
      { id: 'hard', name: 'Hard', description: 'For cinema experts' }
    ]
  }
}

export default new GeminiService()

// Made with Bob