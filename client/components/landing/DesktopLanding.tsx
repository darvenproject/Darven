'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient, getImageUrl } from '@/lib/api'

interface LandingImage {
  id?: number
  category: string
  image_url: string
  portrait_image_url?: string
  title: string
  link?: string
}

export default function DesktopLanding() {
  const [heroImages, setHeroImages] = useState<LandingImage[]>([])
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [sectionImages, setSectionImages] = useState<LandingImage[]>([
    { category: 'ready-made', image_url: '/placeholder.jpg', title: 'Ready Made', link: '/ready-made' },
    { category: 'stitch-your-own', image_url: '/placeholder.jpg', title: 'Stitch Your Own Suit', link: '/stitch-your-own' },
    { category: 'fabric', image_url: '/placeholder.jpg', title: 'Fabric', link: '/fabric' },
  ])
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLandingImages()
  }, [])

  // Hero carousel auto-play
  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  // Track which section is in view
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const sectionHeight = window.innerHeight
      const heroOffset = heroImages.length > 0 ? 1 : 0
      
      let currentSection = Math.round(scrollTop / sectionHeight)
      
      // If we're past hero, calculate section index
      if (currentSection > 0 && heroOffset > 0) {
        setCurrentSectionIndex(currentSection - 1)
      } else if (heroOffset === 0) {
        setCurrentSectionIndex(currentSection)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [heroImages.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleNextSection()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrevSection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSectionIndex, sectionImages.length])

  const fetchLandingImages = async () => {
    try {
      const response = await apiClient.getLandingImages()
      if (response.data && response.data.length > 0) {
        const heroes = response.data.filter((img: LandingImage) => img.category === 'hero')
        const others = response.data.filter((img: LandingImage) => img.category !== 'hero')
        
        const orderedSections = ['ready-made', 'stitch-your-own', 'fabric']
        const sortedOthers = orderedSections
          .map(cat => others.find((img: LandingImage) => img.category === cat))
          .filter(Boolean) as LandingImage[]
        
        if (heroes.length > 0) setHeroImages(heroes)
        if (sortedOthers.length > 0) setSectionImages(sortedOthers)
      }
    } catch (error) {
      console.error('Error fetching landing images:', error)
    }
  }

  const scrollToSection = (index: number) => {
    const heroOffset = heroImages.length > 0 ? 1 : 0
    const targetScroll = (index + heroOffset) * window.innerHeight
    containerRef.current?.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })
  }

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1)
    }
  }

  const handleNextSection = () => {
    if (currentSectionIndex < sectionImages.length - 1) {
      scrollToSection(currentSectionIndex + 1)
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
        <div className="h-screen w-full snap-start snap-always relative">
          {heroImages.map((heroImage, index) => (
            <motion.div
              key={`hero-${heroImage.id || index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentHeroIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
              style={{ zIndex: index === currentHeroIndex ? 10 : 0 }}
            >
              <div className="absolute inset-0 bg-gray-300 dark:bg-dark-surface">
                <div className="relative h-full w-full">
                  <Image
                    src={getImageUrl(heroImage.image_url)}
                    alt={heroImage.title || 'Hero Image'}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    loading="eager"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </motion.div>
          ))}

          {/* Hero Navigation Arrows */}
          {heroImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all z-30"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all z-30"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Scroll Down Hint */}
          <button
            onClick={() => scrollToSection(0)}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:scale-110 transition-transform duration-300 animate-bounce z-20"
            aria-label="Scroll down"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Category Sections - Full Screen Each */}
      {sectionImages.map((item, index) => (
        <Link
          key={`${item.category}-${index}`}
          href={item.link!}
          className="h-screen w-full snap-start snap-always block relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.5 }}
            className="h-full w-full relative group"
          >
            {/* Image Container */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-dark-surface">
              <Image
                src={getImageUrl(item.image_url)}
                alt={item.title}
                fill
                sizes="100vw"
                priority
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
          </motion.div>
        </Link>
      ))}

      {/* Navigation Controls - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {/* Up Arrow */}
        {currentSectionIndex > 0 && (
          <button
            onClick={handlePrevSection}
            className="p-2.5 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-all"
            aria-label="Previous section"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        {/* Navigation Dots */}
        {sectionImages.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSectionIndex === index 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}

        {/* Down Arrow */}
        {currentSectionIndex < sectionImages.length - 1 && (
          <button
            onClick={handleNextSection}
            className="p-2.5 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-all"
            aria-label="Next section"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}