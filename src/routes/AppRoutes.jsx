import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MovieDetails from '../pages/MovieDetails'
import Profile from '../pages/Profile'
import Watchlist from '../pages/Watchlist'
import Diary from '../pages/Diary'
import Search from '../pages/Search'
import Favorites from '../pages/Favorites'
import Followers from '../pages/Followers'
import Following from '../pages/Following'
import Settings from '../pages/Settings'
import Notifications from '../pages/Notifications'
import NotFound from '../pages/NotFound'
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/login' element={<Login />} />

        <Route path='/register' element={<Register />} />

        <Route path='/movie/:id' element={<MovieDetails />} />

        <Route path='/search' element={<Search />} />

        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/watchlist' element={<Watchlist />} />
          <Route path='/diary' element={<Diary />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/followers' element={<Followers />} />
          <Route path='/following' element={<Following />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/notifications' element={<Notifications />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes