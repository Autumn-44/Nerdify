import { createContext, useEffect, useState } from 'react'
import { onAuthStateChange, logout as authLogout, getCurrentUser, getProfilePhoto, checkRedirectResult } from '../services/authService'

export const AuthContext = createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle redirect sign-in result (Google sign-in on deployed sites)
    checkRedirectResult().catch(() => {})

    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // Check if photo is stored in localStorage
        let photoURL = firebaseUser.photoURL
        if (photoURL && photoURL.startsWith('local:')) {
          const uid = photoURL.replace('local:', '')
          photoURL = getProfilePhoto(uid)
        }
        
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: photoURL,
          emailVerified: firebaseUser.emailVerified,
        })
      } else {
        // User is signed out
        setUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const logout = async () => {
    const result = await authLogout()
    if (result.success) {
      setUser(null)
    }
    return result
  }

  const refreshUser = async () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      // Force reload user data from Firebase
      await currentUser.reload()
      
      // Check if photo is stored in localStorage
      let photoURL = currentUser.photoURL
      if (photoURL && photoURL.startsWith('local:')) {
        const uid = photoURL.replace('local:', '')
        photoURL = getProfilePhoto(uid)
      }
      
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: photoURL,
        emailVerified: currentUser.emailVerified,
      })
    }
  }

  const value = {
    user,
    loading,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

// Made with Bob
