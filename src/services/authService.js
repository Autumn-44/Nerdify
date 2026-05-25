import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '../config/firebase'

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name
 * @returns {Promise<Object>} User credential object
 */
export const register = async (email, password, displayName) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    })

    // Send email verification
    await sendEmailVerification(userCredential.user)

    return {
      success: true,
      user: userCredential.user,
      message: 'Registration successful! Please check your email to verify your account.',
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    }
  }
}

/**
 * Sign in user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User credential object
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    return {
      success: true,
      user: userCredential.user,
      message: 'Login successful!',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    }
  }
}

/**
 * Sign in with Google
 * @returns {Promise<Object>} User credential object
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)

    return {
      success: true,
      user: userCredential.user,
      message: 'Google sign-in successful!',
    }
  } catch (error) {
    console.error('Google sign-in error:', error)
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    }
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Success status
 */
export const logout = async () => {
  try {
    await signOut(auth)
    return {
      success: true,
      message: 'Logout successful!',
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    }
  }
}

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>} Success status
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox.',
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    }
  }
}

/**
 * Resend email verification
 * @returns {Promise<Object>} Success status
 */
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      return {
        success: false,
        message: 'No user is currently signed in.',
      }
    }

    await sendEmailVerification(user)
    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    }
  } catch (error) {
    console.error('Resend verification error:', error)
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    }
  }
}

/**
 * Subscribe to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get current authenticated user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser
}

/**
 * Convert Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please register first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
    'auth/cancelled-popup-request': 'Only one popup request is allowed at a time.',
  }

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.'
}

export default {
  register,
  login,
  loginWithGoogle,
  logout,
  resetPassword,
  resendVerificationEmail,
  onAuthStateChange,
  getCurrentUser,
}

// Made with Bob
