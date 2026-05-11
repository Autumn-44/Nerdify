function ActivityFeed({ activities }) {
  return (
    <div className='space-y-4'>
      {activities.map((activity, index) => (
        <div
          key={index}
          className='bg-[#1c1f26] p-4 rounded-lg'
        >
          {activity.text}
        </div>
      ))}
    </div>
  )
}

export default ActivityFeed