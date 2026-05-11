function UserStats({ stats }) {
  return (
    <div className='flex gap-8'>
      <div>
        <h3 className='text-xl font-bold'>{stats.movies}</h3>
        <p>Movies</p>
      </div>

      <div>
        <h3 className='text-xl font-bold'>{stats.followers}</h3>
        <p>Followers</p>
      </div>

      <div>
        <h3 className='text-xl font-bold'>{stats.following}</h3>
        <p>Following</p>
      </div>
    </div>
  )
}

export default UserStats