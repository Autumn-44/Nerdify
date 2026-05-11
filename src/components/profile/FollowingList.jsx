function FollowingList({ following }) {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>
        Following
      </h2>

      {following.map((user, index) => (
        <p key={index}>{user.username}</p>
      ))}
    </div>
  )
}

export default FollowingList