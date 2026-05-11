import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    // TODO: wire this to auth service
    console.log('Login attempt', formData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>

      <Input
        type='email'
        name='email'
        placeholder='Email'
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        type='password'
        name='password'
        placeholder='Password'
        value={formData.password}
        onChange={handleChange}
      />

      <Button type='submit' text='Login' />
    </form>
  )
}

export default LoginForm
