import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AuthProvider from './context/AuthContext'
import RatingsProvider from './context/RatingsContext'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RatingsProvider>
        <App />
      </RatingsProvider>
    </AuthProvider>
  </React.StrictMode>
)
