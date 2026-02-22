'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiClient, getImageUrl } from '@/lib/api'

interface LandingImage {
  id?: number
  category: string
  image_url: string
  portrait_image_url?: string
  title: string
  link?: string
}

export default function MobileLanding() {
  const [heroImages, setHeroImages] = useState<LandingImage[]>([])
  const [sectionImages, setSectionImages] = useState<LandingImage[]>([
    { category: 'ready-made', image_url: '/placeholder.jpg', title: 'Ready Made', link: '/ready-made' },
    { category: 'stitch-your-own', image_url: '/placeholder.jpg', title: 'Stitch Your Own Suit', link: '/stitch-your-own' },
    { category: 'fabric', image_url: '/placeholder.jpg', title: 'Fabric', link: '/fabric' },
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [heroTouchStart, setHeroTouchStart] = useState(0)
  const [heroTouchEnd, setHeroTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLandingImages()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const index = Math.round(scrollTop / window.innerHeight)
      setCurrentIndex(index)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Total slides: 1 hero + 3 sections + 1 footer = 5
      const totalSections = (heroImages.length > 0 ? 1 : 0) + sectionImages.length + 1
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (currentIndex < totalSections - 1) {
          containerRef.current?.scrollTo({
            top: (currentIndex + 1) * window.innerHeight,
            behavior: 'smooth'
          })
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (currentIndex > 0) {
          containerRef.current?.scrollTo({
            top: (currentIndex - 1) * window.innerHeight,
            behavior: 'smooth'
          })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, heroImages.length, sectionImages.length])

  useEffect(() => {
    if (heroImages.length <= 1 || currentIndex !== 0) return

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length, currentIndex])

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    setHeroTouchStart(e.targetTouches[0].clientX)
  }

  const handleHeroTouchMove = (e: React.TouchEvent) => {
    setHeroTouchEnd(e.targetTouches[0].clientX)
  }

  const handleHeroTouchEnd = () => {
    if (!heroTouchStart || !heroTouchEnd) return
    const distance = heroTouchStart - heroTouchEnd
    if (distance > 50) {
      setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))
    } else if (distance < -50) {
      setCurrentHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))
    }
    setHeroTouchStart(0)
    setHeroTouchEnd(0)
  }

  const fetchLandingImages = async () => {
    try {
      const response = await apiClient.getLandingImages()
      if (response.data && response.data.length > 0) {
        const heroes = response.data.filter((img: LandingImage) => img.category === 'hero')
        const otherImages = response.data.filter((img: LandingImage) => img.category !== 'hero')
        
        const orderedSections = ['ready-made', 'stitch-your-own', 'fabric']
        const sortedOthers = orderedSections
          .map(cat => otherImages.find((img: LandingImage) => img.category === cat))
          .filter(Boolean) as LandingImage[]
        
        if (heroes.length > 0) setHeroImages(heroes)
        if (sortedOthers.length > 0) setSectionImages(sortedOthers)
      }
    } catch (error) {
      console.error('Error fetching landing images:', error)
    }
  }

  const scrollToNext = () => {
    const totalSections = (heroImages.length > 0 ? 1 : 0) + sectionImages.length + 1
    if (currentIndex < totalSections - 1) {
      containerRef.current?.scrollTo({
        top: (currentIndex + 1) * window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Hero Section */}
      {heroImages.length > 0 && (
        <div 
          className="h-screen w-full snap-start snap-always relative"
          onTouchStart={handleHeroTouchStart}
          onTouchMove={handleHeroTouchMove}
          onTouchEnd={handleHeroTouchEnd}
        >
          {heroImages.map((heroImage, index) => {
            const imageUrl = heroImage.portrait_image_url || heroImage.image_url
            return (
              <div
                key={`hero-${heroImage.id || index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="absolute inset-0" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="relative h-full w-full">
                    <Image
                      src={getImageUrl(imageUrl)}
                      alt={heroImage.title || 'Hero Image'}
                      fill
                      sizes="100vw"
                      priority={index === 0}
                      loading="eager"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30" />
              </div>
            )
          })}

          {/* Hero Navigation Dots */}
          {heroImages.length > 1 && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
              {heroImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    currentHeroIndex === index ? 'bg-white w-6' : 'bg-white bg-opacity-40 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Scroll Down Hint */}
          {currentIndex === 0 && (
            <button
              onClick={scrollToNext}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-20"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Category Sections */}
      {sectionImages.map((item, index) => {
        const imageUrl = item.portrait_image_url || item.image_url
        return (
          <Link
            key={`${item.category}-${index}`}
            href={item.link!}
            className="h-screen w-full snap-start snap-always block relative"
          >
            <div className="absolute inset-0" style={{ backgroundColor: '#2a2a2a' }}>
              <div className="relative h-full w-full">
                <Image
                  src={getImageUrl(imageUrl)}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Subtle Overlay to maintain premium feel */}
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          </Link>
        )
      })}

      {/* Footer Section */}
      <div className="h-screen w-full snap-start snap-always relative bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-white">
          <div className="text-center w-full">
            {/* Logo or Brand Name */}
            <h2 className="text-4xl font-bold mb-10 tracking-wider">DARVEN</h2>
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-8 mb-10">
              <div>
                <h3 className="text-lg font-semibold mb-4">Shop</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/ready-made" className="hover:text-gray-300 transition-colors">Ready Made</Link></li>
                  <li><Link href="/stitch-your-own" className="hover:text-gray-300 transition-colors">Stitch Your Own</Link></li>
                  <li><Link href="/fabric" className="hover:text-gray-300 transition-colors">Fabric</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-gray-300 transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link></li>
                  <li><Link href="/careers" className="hover:text-gray-300 transition-colors">Careers</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link></li>
                  <li><Link href="/shipping" className="hover:text-gray-300 transition-colors">Shipping</Link></li>
                  <li><Link href="/returns" className="hover:text-gray-300 transition-colors">Returns</Link></li>
                </ul>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 pt-6 max-w-sm mx-auto">
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} DARVEN. All rights reserved.
              </p>
              <div className="mt-3 space-x-4 text-xs">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Navigation Dots (Fixed) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {[
          ...(heroImages.length > 0 ? [0] : []), 
          ...sectionImages.map((_, i) => i + (heroImages.length > 0 ? 1 : 0)),
          (heroImages.length > 0 ? 1 : 0) + sectionImages.length // Footer dot
        ].map((sectionIndex, dotIndex) => (
          <div
            key={dotIndex}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === sectionIndex ? 'bg-white w-8' : 'bg-white bg-opacity-40 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  )
}