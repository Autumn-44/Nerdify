// Temporary test file to check if environment variables are loaded
console.log('Firebase Config Check:')
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY)
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN)
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID)
console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET)
console.log('Messaging Sender ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID)
console.log('App ID:', import.meta.env.VITE_FIREBASE_APP_ID)

export const checkConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  
  console.log('Full config:', config)
  
  const missingVars = Object.entries(config)
    .filter(([key, value]) => !value || value === 'undefined')
    .map(([key]) => key)
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars)
    return false
  }
  
  console.log('All environment variables are loaded correctly!')
  return true
}

// Made with Bob
