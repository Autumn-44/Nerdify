import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../services/authService'
import MainLayout from '../layouts/MainLayout'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const result = await resetPassword(email)

    if (result.success) {
      setMessage(result.message)
      setEmail('')
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <MainLayout>
      <div className='max-w-md mx-auto mt-20 bg-[#1c1f26] p-8 rounded-xl'>
        <h1 className='text-4xl font-bold mb-4'>
          Reset Password
        </h1>
        <p className='text-gray-400 mb-8'>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className='bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        {message && (
          <div className='bg-primary-500/10 border border-primary-500 text-primary-400 p-3 rounded-lg mb-4'>
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
            disabled={loading}
          />

          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition duration-200'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className='mt-5 text-center'>
          <Link to='/login' className='text-blue-500 hover:underline'>
            Back to Login
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}

export default ForgotPassword

// Made with Bob
