import { HashRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import TVShows from '../pages/TVShows'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Search from '../pages/Search'
import Watchlist from '../pages/Watchlist'
import Diary from '../pages/Diary'
import MovieDetails from '../pages/MovieDetails'
import TVShowDetails from '../pages/TVShowDetails'
import ActorProfile from '../pages/ActorProfile'
import LetterboxdImport from '../pages/LetterboxdImport'
import Quiz from '../pages/Quiz'
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/tv-shows' element={<TVShows />} />

        <Route path='/login' element={<Login />} />

        <Route path='/register' element={<Register />} />

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
              <Watchlist />
            </ProtectedRoute>
          }
        />

        <Route path='/import' element={<LetterboxdImport />} />

        <Route path='/quiz' element={<Quiz />} />
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes

// Made with Bob
