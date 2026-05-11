const login = async userData => {
  console.log('Login User', userData)
}

const register = async userData => {
  console.log('Register User', userData)
}

const logout = () => {
  console.log('Logout User')
}

export default {
  login,
  register,
  logout,
}