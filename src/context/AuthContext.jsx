import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = readJson('user', null)

    if (savedUser) {
      setUser(savedUser)
    }
  }, [])

  const signup = (name, email, password) => {
    const users = readJson('users', [])

    const existingUser = users.find(
      user => user.email === email
    )

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      }
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    }

    users.push(newUser)

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    )

    localStorage.setItem(
      'user',
      JSON.stringify(newUser)
    )

    setUser(newUser)

    return {
      success: true,
    }
  }

  const login = (email, password) => {
    const users = readJson('users', [])

    const foundUser = users.find(
      user =>
        user.email === email &&
        user.password === password
    )

    if (!foundUser) {
      return {
        success: false,
        message: 'Invalid credentials',
      }
    }

    localStorage.setItem(
      'user',
      JSON.stringify(foundUser)
    )

    setUser(foundUser)

    return {
      success: true,
    }
  }

  const logout = () => {
    localStorage.removeItem('user')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
