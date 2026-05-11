function FollowersList({ followers }) {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>
        Followers
      </h2>

      {followers.map((user, index) => (
        <p key={index}>{user.username}</p>
      ))}
    </div>
  )
}

export default FollowersList