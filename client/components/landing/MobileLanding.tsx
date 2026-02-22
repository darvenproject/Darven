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
      const totalSections = (heroImages.length > 0 ? 1 : 0) + sectionImages.length
      
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
    const totalSections = (heroImages.length > 0 ? 1 : 0) + sectionImages.length
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

      {/* Category Sections - TEXT REMOVED */}
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

      {/* Vertical Navigation Dots (Fixed) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {[...(heroImages.length > 0 ? [0] : []), ...sectionImages.map((_, i) => i + (heroImages.length > 0 ? 1 : 0))].map((sectionIndex, dotIndex) => (
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