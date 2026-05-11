function AuthLayout({ children }) {
  return (
    <div className='min-h-screen flex justify-center items-center bg-[#14181c] text-white'>
      <div className='bg-[#1c1f26] p-10 rounded-xl w-[400px] shadow-lg'>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout