import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function PageTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionClass, setTransitionClass] = useState('page-transition')

  useEffect(() => {
    // Determine transition direction based on route
    const getTransitionClass = (pathname) => {
      if (pathname === '/') return 'page-transition-fade-up'
      if (pathname === '/tv-shows') return 'page-transition-slide-right'
      if (pathname === '/quiz') return 'page-transition-scale'
      if (pathname.startsWith('/movie/') || pathname.startsWith('/tv/')) return 'page-transition-scale'
      return 'page-transition'
    }

    setTransitionClass(getTransitionClass(location.pathname))
    setDisplayLocation(location)
  }, [location])

  return (
    <div className={`${transitionClass} gpu-accelerated`} key={displayLocation.pathname}>
      {children}
    </div>
  )
}

export default PageTransition

// Made with Bob
