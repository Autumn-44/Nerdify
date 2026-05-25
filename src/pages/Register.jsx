import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register, loginWithGoogle } from '../services/authService'
import MainLayout from '../layouts/MainLayout'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    const result = await register(email, password, name)

    if (result.success) {
      setMessage(result.message)
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    const result = await loginWithGoogle()

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <MainLayout>
      <div className='max-w-md mx-auto mt-20 bg-[#1c1f26] p-8 rounded-xl'>
        <h1 className='text-4xl font-bold mb-8'>
          Create Account
        </h1>

        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        {message && (
          <div className='bg-green-500/10 border border-green-500 text-green-400 p-3 rounded-lg mb-4'>
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <input
            type='text'
            placeholder='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
            disabled={loading}
          />

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
            disabled={loading}
          />

          <input
            type='password'
            placeholder='Password (min. 6 characters)'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
            minLength={6}
            disabled={loading}
          />

          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
            minLength={6}
            disabled={loading}
          />

          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='relative my-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-600'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-[#1c1f26] text-gray-400'>Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className='w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loading}
        >
          <svg className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='#4285F4'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='#34A853'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='#FBBC05'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='#EA4335'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          Sign up with Google
        </button>

        <p className='text-gray-400 mt-4 text-center'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 hover:underline'>
            Log in
          </Link>
        </p>
      </div>
    </MainLayout>
  )
}

export default Register

// Made with Bob
