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

  // Auto-advance hero slideshow every 5 seconds
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
      console.log('Landing images response:', response.data)
      if (response.data && response.data.length > 0) {
        // Separate hero section(s) from other images
        const heroes = response.data.filter((img: LandingImage) => img.category === 'hero')
        const others = response.data.filter((img: LandingImage) => img.category !== 'hero')
        
        // Sort the sections in a specific order
        const orderedSections = ['ready-made', 'stitch-your-own', 'fabric']
        const sortedOthers = orderedSections
          .map(cat => others.find((img: LandingImage) => img.category === cat))
          .filter(Boolean) as LandingImage[]
        
        console.log('Hero images:', heroes.length, heroes)
        console.log('Section images (sorted):', sortedOthers)
        
        if (heroes.length > 0) {
          setHeroImages(heroes)
        }
        if (sortedOthers.length > 0) {
          setSectionImages(sortedOthers)
        }
      }
    } catch (error) {
      console.error('Error fetching landing images:', error)
      console.log('Using default images')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Full Width at Top with Slideshow */}
      {heroImages.length > 0 && (
        <div className="h-screen relative overflow-hidden">
          {/* Slideshow Images */}
          {heroImages.map((heroImage, index) => (
            <motion.div
              key={`hero-${heroImage.id || index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentHeroIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
              style={{ zIndex: index === currentHeroIndex ? 10 : 0 }}
            >
              {/* Image */}
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
                    onError={(e) => {
                      console.error('Failed to load hero image:', getImageUrl(heroImage.image_url))
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded hero image ${index + 1}/${heroImages.length}:`, getImageUrl(heroImage.image_url))
                    }}
                  />
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </motion.div>
          ))}

          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
           
          </div>

          {/* Navigation Arrows */}
          {heroImages.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all z-30 group"
                aria-label="Previous slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all z-30 group"
                aria-label="Next slide"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Navigation Dots */}
          {heroImages.length > 1 && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHeroIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentHeroIndex === index
                      ? 'bg-white w-8'
                      : 'bg-white bg-opacity-50 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Scroll Down Button */}
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              })
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:scale-110 transition-transform duration-300 animate-bounce z-20"
            aria-label="Scroll down"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Three Columns Section - Bottom Half */}
      <div className="h-screen flex gap-0 overflow-hidden">
        {sectionImages.map((item, index) => {
          console.log(`Rendering section ${index}:`, item.category, item.title, getImageUrl(item.image_url))
          return (
          <Link
            key={`${item.category}-${item.image_url}`}
            href={item.link!}
            className="flex-1 relative group overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (heroImages.length > 0 ? 0.3 : 0) + index * 0.2 }}
              className="relative h-full w-full"
            >
              {/* Image */}
              <div className="absolute inset-0 bg-gray-300 dark:bg-dark-surface">
                <div className="relative h-full w-full">
                  <Image
                    src={getImageUrl(item.image_url)}
                    alt={item.title}
                    fill
                    sizes="33vw"
                    priority
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      console.error('Failed to load section image:', getImageUrl(item.image_url))
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                    onLoad={() => {
                      console.log('Successfully loaded section image:', getImageUrl(item.image_url))
                    }}
                  />
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />

              {/* Text */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <h2 className="text-white text-3xl md:text-4xl font-bold text-center px-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
                  {item.title}
                </h2>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          </Link>
        )})}
      
      </div>
    </div>
  )
}
