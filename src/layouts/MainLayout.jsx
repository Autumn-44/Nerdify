import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

function MainLayout({ children }) {
  return (
    <div className='min-h-screen text-white flex flex-col' style={{ background: '#0d1117' }}>
      <Navbar />
      <main className='flex-1 px-6 md:px-10 py-6 max-w-[1400px] w-full mx-auto'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
