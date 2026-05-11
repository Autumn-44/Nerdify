import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'

function DashboardLayout({ children }) {
  return (
    <div className='min-h-screen bg-[#14181c] text-white'>
      <Navbar />

      <div className='flex'>
        <Sidebar />

        <main className='flex-1 p-8'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout