'use client'

import { usePathname } from 'next/navigation'
import ThemeProvider from './ThemeProvider'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <ThemeProvider>
      <div className="bg-white min-h-screen flex flex-col" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
        {!isAdminPage && <Header />}
        <main className={`flex-1 ${!isAdminPage ? 'pt-20' : ''}`} style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y pan-x' }}>{children}</main>
        {!isLandingPage && !isAdminPage && <Footer />}
      </div>
    </ThemeProvider>
  )
}
