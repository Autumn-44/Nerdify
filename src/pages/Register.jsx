import { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

function Register() {
  const { signup } = useContext(AuthContext)

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = e => {
    e.preventDefault()

    const result = signup(name, email, password)

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
          Create Account
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
            type='text'
            placeholder='Name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='bg-[#14181c] p-3 rounded-lg outline-none'
            required
          />

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
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200'
          >
            Create Account
          </button>
        </form>

        <p className='text-gray-400 mt-4'>
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