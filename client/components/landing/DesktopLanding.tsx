'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    fetchLandingImages()
  }, [])

  useEffect(() => {
    if (heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      {heroImages.length > 0 && (
        <div className="h-screen relative overflow-hidden">
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

          {/* Navigation Arrows */}
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

          {/* Scroll Down Button */}
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:scale-110 transition-transform duration-300 animate-bounce z-20"
            aria-label="Scroll down"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Three Columns Section */}
      <div className="h-screen flex gap-0 overflow-hidden">
        {sectionImages.map((item, index) => (
          <Link
            key={`${item.category}-${index}`}
            href={item.link!}
            className="flex-1 relative group overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (heroImages.length > 0 ? 0.3 : 0) + index * 0.2 }}
              className="relative h-full w-full"
            >
              {/* Image Container */}
              <div className="absolute inset-0 bg-gray-300 dark:bg-dark-surface">
                <Image
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  fill
                  sizes="33vw"
                  priority
                  unoptimized
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Overlay - Subtle darkening that fades slightly on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300" />

              {/* Minimal Hover Indicator (Bottom Bar) */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}