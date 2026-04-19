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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Total slides: 1 hero + 3 sections + 1 footer = 5
  const totalSlides = 5

  useEffect(() => {
    fetchLandingImages()
  }, [])

  // Hero carousel auto-play
  useEffect(() => {
    if (heroImages.length <= 1 || currentSlideIndex !== 0) return

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length, currentSlideIndex])

  // Track which slide is in view
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const slideHeight = window.innerHeight
      const currentSlide = Math.round(scrollTop / slideHeight)
      setCurrentSlideIndex(currentSlide)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleNextSlide()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlideIndex])

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

  const scrollToSlide = (slideIndex: number) => {
    const targetScroll = slideIndex * window.innerHeight
    containerRef.current?.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })
  }

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      scrollToSlide(currentSlideIndex - 1)
    }
  }

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      scrollToSlide(currentSlideIndex + 1)
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

      {/* Slide 1: Hero Banner */}
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
          {currentSlideIndex === 0 && (
            <button
              onClick={() => scrollToSlide(1)}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white hover:scale-110 transition-transform duration-300 animate-bounce z-20"
              aria-label="Scroll down"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Slides 2-4: Category Sections */}
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

      {/* Slide 5: Footer */}
      <div className="h-screen w-full snap-start snap-always relative bg-white">
        <div className="container mx-auto px-6 lg:px-12 xl:px-24 h-full flex flex-col justify-center items-center text-black max-w-screen-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center w-full"
          >
            {/* Logo or Brand Name */}
            <h2 className="text-5xl md:text-6xl font-bold mb-12 tracking-wider">DARVEN</h2>
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-16 max-w-6xl mx-auto">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-6">Shop</h3>
                <ul className="space-y-3 text-base md:text-lg">
                  <li><Link href="/ready-made" className="hover:text-gray-600 transition-colors">Ready Made</Link></li>
                  <li><Link href="/stitch-your-own" className="hover:text-gray-600 transition-colors">Stitch Your Own</Link></li>
                  <li><Link href="/fabric" className="hover:text-gray-600 transition-colors">Fabrics</Link></li>
                  <li><Link href="/cart" className="hover:text-gray-600 transition-colors">Cart</Link></li>
                  <li><Link href="/about" className="hover:text-gray-600 transition-colors">About Us</Link></li>
                  <li><Link href="/size-chart" className="hover:text-gray-600 transition-colors">Size Chart</Link></li>
                  <li><Link href="/return-exchange-policy" className="hover:text-gray-600 transition-colors">Return & Exchange Policy</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-6">Contact</h3>
                <ul className="space-y-3 text-base md:text-lg">
                  <li><Link href="/contact" className="hover:text-gray-600 transition-colors">Contact Us</Link></li>
                  <li>Karachi, Pakistan</li>
                </ul>
                {/* Social Icons */}
                <div className="flex items-center gap-6 mt-6">
                  <a href="mailto:shopdarven@gmail.com" aria-label="Email" className="hover:text-gray-500 transition-colors transform hover:scale-110 duration-200">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/shopdarven/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gray-500 transition-colors transform hover:scale-110 duration-200">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61580410082761" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gray-500 transition-colors transform hover:scale-110 duration-200">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-8 mb-12">
              <a href="https://www.facebook.com/profile.php?id=61580410082761" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors transform hover:scale-110 duration-200" aria-label="Facebook">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/shopdarven/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors transform hover:scale-110 duration-200" aria-label="Instagram">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/shopdarven/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors transform hover:scale-110 duration-200" aria-label="Twitter">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-300 pt-10 max-w-4xl mx-auto w-full">
              <p className="text-gray-600 text-base md:text-lg">
                © {new Date().getFullYear()} DARVEN. All rights reserved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {/* Up Arrow */}
        {currentSlideIndex > 0 && (
          <button
            onClick={handlePrevSlide}
            className="p-2.5 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        {/* Navigation Dots for all 5 slides */}
        {[0, 1, 2, 3, 4].map((slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => scrollToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlideIndex === slideIndex 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}

        {/* Down Arrow */}
        {currentSlideIndex < totalSlides - 1 && (
          <button
            onClick={handleNextSlide}
            className="p-2.5 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full transition-all"
            aria-label="Next slide"
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