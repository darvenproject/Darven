'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'

const DesktopLanding = dynamic(() => import('@/components/landing/DesktopLanding'), {
  loading: () => <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>,
  ssr: false
})

const MobileLanding = dynamic(() => import('@/components/landing/MobileLanding'), {
  loading: () => <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>,
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

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen">
      {isMobile ? <MobileLanding /> : <DesktopLanding />}
    </div>
  )
}
