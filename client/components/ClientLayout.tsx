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
      <div className={`bg-white dark:bg-dark-bg ${!isAdminPage && 'transition-colors duration-300'} ${isLandingPage ? 'flex flex-col h-screen overflow-hidden' : 'min-h-screen flex flex-col'}`}>
        {!isAdminPage && <Header />}
        <main className={isLandingPage ? 'flex-1 overflow-hidden' : 'flex-1'}>{children}</main>
        {!isLandingPage && !isAdminPage && <Footer />}
      </div>
    </ThemeProvider>
  )
}
