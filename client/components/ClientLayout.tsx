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
      <div
        className="bg-white min-h-screen flex flex-col"
        style={{
          overflowX: 'hidden',
          // On landing page the snap container handles its own scroll — don't interfere
          overflowY: isLandingPage ? 'hidden' : 'auto',
        }}
      >
        {!isAdminPage && <Header />}
        <main
          className="flex-1"
          style={{
            // Landing page: NO top padding — hero must sit under the transparent header
            // All other pages: pt-20 (80px) to clear the fixed header
            paddingTop: isLandingPage || isAdminPage ? '0' : '5rem',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y pan-x',
          }}
        >
          {children}
        </main>
        {!isLandingPage && !isAdminPage && <Footer />}
      </div>
    </ThemeProvider>
  )
}