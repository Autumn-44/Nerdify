import {
  HashRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Search from '../pages/Search'
import Watchlist from '../pages/Watchlist'
import MovieDetails from '../pages/MovieDetails'
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route
          path='/login'
          element={<Login />}
        />

        <Route
          path='/register'
          element={<Register />}
        />

        <Route
          path='/search'
          element={<Search />}
        />

        <Route
          path='/movie/:id'
          element={<MovieDetails />}
        />

        <Route
          path='/watchlist'
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes