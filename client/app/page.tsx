'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const DesktopLanding = dynamic(() => import('@/components/landing/DesktopLanding'), {
  loading: () => <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>,
  ssr: false
})

const MobileLanding = dynamic(() => import('@/components/landing/MobileLanding'), {
  loading: () => <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>,
  ssr: false
})

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Force scroll to top on initial mount and when layout switches
  useEffect(() => {
    if (mounted) {
      window.scrollTo(0, 0);
      
      // Small timeout to ensure dynamic components have finished their initial render
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [mounted, isMobile]);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {isMobile ? <MobileLanding /> : <DesktopLanding />}
    </main>
  )
}