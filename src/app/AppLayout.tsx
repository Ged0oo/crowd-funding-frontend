import { Outlet } from 'react-router-dom'
import Navbar from '../shared/components/layout/Navbar'
import Footer from '../shared/components/layout/Footer'
import PageWrapper from '../shared/components/layout/PageWrapper'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Navbar />
      <PageWrapper>
        <Outlet />
      </PageWrapper>
      <Footer />
    </div>
  )
}
