import { HashRouter, Routes, Route } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'

import Home from '../pages/Home'
import TVShows from '../pages/TVShows'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import Search from '../pages/Search'
import WatchlistNew from '../pages/WatchlistNew'
import Diary from '../pages/Diary'
import MovieDetails from '../pages/MovieDetails'
import TVShowDetails from '../pages/TVShowDetails'
import ActorProfile from '../pages/ActorProfile'
import LetterboxdImport from '../pages/LetterboxdImport'
import Quiz from '../pages/Quiz'
import Settings from '../pages/Settings'
import Profile from '../pages/Profile'
import Favorites from '../pages/Favorites'
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  return (
    <HashRouter>
      <PageTransition>
        <Routes>
          <Route path='/' element={<Home />} />

        <Route path='/tv-shows' element={<TVShows />} />

        <Route path='/login' element={<Login />} />

        <Route path='/register' element={<Register />} />

        <Route path='/forgot-password' element={<ForgotPassword />} />

        <Route path='/search' element={<Search />} />

        <Route path='/movie/:id' element={<MovieDetails />} />

        <Route path='/tv/:id' element={<TVShowDetails />} />

        <Route path='/actor/:id' element={<ActorProfile />} />

        <Route
          path='/diary'
          element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          }
        />

        <Route
          path='/watchlist'
          element={
            <ProtectedRoute>
              <WatchlistNew />
            </ProtectedRoute>
          }
        />

        <Route path='/import' element={<LetterboxdImport />} />

        <Route path='/quiz' element={<Quiz />} />

        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/favorites'
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        </Routes>
      </PageTransition>
    </HashRouter>
  )
}

export default AppRoutes

// Made with Bob
