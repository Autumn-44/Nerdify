import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

function Login() {
  const { login } = useContext(AuthContext)

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = e => {
    e.preventDefault()

    const result = login(email, password)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/')
  }

  return (
    <MainLayout>
      <div className='max-w-md mx-auto mt-20 bg-[#1c1f26] p-8 rounded-xl'>
        <h1 className='text-4xl font-bold mb-8'>
          Login
        </h1>

        {error && (
          <p className='text-red-400 mb-4'>
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
        >
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
          />

          <button
            type='submit'
            className='bg-blue-500 py-3 rounded-lg font-semibold'
          >
            Login
          </button>
        </form>

        <p className='mt-5 text-gray-400'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </MainLayout>
  )
}

export default Login