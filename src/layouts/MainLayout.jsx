import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function MainLayout({ children }) {
  return (
    <div className='min-h-screen bg-[#14181c] text-white flex flex-col'>
      <Navbar />

      <main className='flex-1 px-8 py-6'>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout