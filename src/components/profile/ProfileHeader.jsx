function ProfileHeader({ user }) {
  return (
    <div className='flex items-center gap-5'>
      <img
        src={user.avatar}
        alt={user.username}
        className='w-24 h-24 rounded-full'
      />

      <div>
        <h1 className='text-3xl font-bold'>
          {user.username}
        </h1>

        <p className='text-gray-400'>{user.bio}</p>
      </div>
    </div>
  )
}

export default ProfileHeader