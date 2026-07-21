function Toast({ message }) {
  return (
    <div className='fixed bottom-5 right-5 bg-primary-500 text-white px-5 py-3 rounded-lg shadow-lg'>
      {message}
    </div>
  )
}

export default Toast