const getUserProfile = async username => {
  console.log('Get User Profile', username)
}

const followUser = async userId => {
  console.log('Follow User', userId)
}

export default {
  getUserProfile,
  followUser,
}