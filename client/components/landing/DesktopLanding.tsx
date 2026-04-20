'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient, getImageUrl } from '@/lib/api'
import { useScrollContainer } from '@/context/ScrollContext'
import logoLight from '@/assets/logo_bg_light.png'

interface LandingImage {
  id?: number
  category: string
  image_url: string
  portrait_image_url?: string
  title: string
  link?: string
}

export default function DesktopLanding() {
  const { scrollContainerRef } = useScrollContainer()

  const [heroImages, setHeroImages] = useState<LandingImage[]>([])
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [sectionImages, setSectionImages] = useState<LandingImage[]>([
    { category: 'ready-made', image_url: '/placeholder.jpg', title: 'Ready Made', link: '/ready-made' },
    { category: 'stitch-your-own', image_url: '/placeholder.jpg', title: 'Stitch Your Own Suit', link: '/stitch-your-own' },
    { category: 'fabric', image_url: '/placeholder.jpg', title: 'Fabric', link: '/fabric' },
  ])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const totalSlides = 5

  useEffect(() => { fetchLandingImages() }, [])

  // Hero auto-play
  useEffect(() => {
    if (heroImages.length <= 1 || currentSlideIndex !== 0) return
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length, currentSlideIndex])

  // Track slide index from scroll container
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      setCurrentSlideIndex(Math.round(container.scrollTop / window.innerHeight))
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); handleNextSlide() }
      else if (e.key === 'ArrowUp') { e.preventDefault(); handlePrevSlide() }
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
    const container = scrollContainerRef.current
    if (!container) return

    container.scrollTo({
      top: slideIndex * window.innerHeight,
      behavior: 'smooth'
    })
  }
  const handlePrevSlide = () => { if (currentSlideIndex > 0) scrollToSlide(currentSlideIndex - 1) }
  const handleNextSlide = () => { if (currentSlideIndex < totalSlides - 1) scrollToSlide(currentSlideIndex + 1) }

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

      {/* Slide 1: Hero */}
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
              <div className="absolute inset-0 bg-gray-300">
                <div className="relative h-full w-full">
                  <Image
                    src={getImageUrl(heroImage.image_url)}
                    alt={heroImage.title || 'Hero Image'}
                    fill sizes="100vw"
                    priority={index === 0} loading="eager" unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </motion.div>
          ))}

          {heroImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
                /* Changed bg-black to bg-white and text-white to text-black */
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-70 hover:bg-opacity-90 text-black rounded-full transition-all z-30 shadow-lg"
                aria-label="Previous hero"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))}
                /* Changed bg-black to bg-white and text-white to text-black */
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-70 hover:bg-opacity-90 text-black rounded-full transition-all z-30 shadow-lg"
                aria-label="Next hero"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {currentSlideIndex === 0 && (
            <button
              onClick={() => scrollToSlide(1)}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white hover:scale-110 transition-transform duration-300 animate-bounce z-20"
              aria-label="Scroll down"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Slides 2–4: Categories */}
      {sectionImages.map((item, index) => (
        <Link
          key={`${item.category}-${index}`}
          href={item.link || '#'}
          className="h-screen w-full snap-start snap-always block relative"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.5 }}
            className="h-full w-full relative group"
          >
            <div className="absolute inset-0 bg-gray-300">
              <Image
                src={getImageUrl(item.image_url)}
                alt={item.title}
                fill sizes="100vw" priority unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
          </motion.div>
        </Link>
      ))}

                  {/* Slide 5: Footer */}
      <div className="h-screen w-full snap-start snap-always bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center w-full px-8 md:px-16 lg:px-24 xl:px-32 max-w-screen-2xl mx-auto text-black"
        >
          {/* Main Logo/Title */}
          <h2 className="text-6xl md:text-7xl font-bold mb-20 tracking-[0.15em]">DARVEN</h2>

          {/* Spread Out Columns Container */}
          <div className="flex flex-row justify-between max-w-5xl mx-auto mb-24 text-left">
            
            {/* Shop Column (Left) */}
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold mb-8 uppercase tracking-widest border-b-2 border-black pb-2 w-fit">Shop</h3>
              <ul className="space-y-4 text-lg md:text-xl font-medium">
                <li><Link href="/ready-made" className="hover:text-gray-500 transition-colors">Ready Made</Link></li>
                <li><Link href="/stitch-your-own" className="hover:text-gray-500 transition-colors">Stitch Your Own</Link></li>
                <li><Link href="/fabric" className="hover:text-gray-500 transition-colors">Fabrics</Link></li>
                <li><Link href="/cart" className="hover:text-gray-500 transition-colors">Cart</Link></li>
                <li><Link href="/about" className="hover:text-gray-500 transition-colors">About Us</Link></li>
                <li><Link href="/size-chart" className="hover:text-gray-500 transition-colors">Size Chart</Link></li>
                <li><Link href="/return-exchange-policy" className="hover:text-gray-500 transition-colors">Return & Policy</Link></li>
              </ul>
            </div>

            {/* Contact Column (Right) */}
            <div className="flex flex-col items-end text-right">
              <h3 className="text-2xl font-bold mb-8 uppercase tracking-widest border-b-2 border-black pb-2 w-fit">Contact</h3>
              <ul className="space-y-4 text-lg md:text-xl font-medium mb-8">
                <li><Link href="/contact" className="hover:text-gray-500 transition-colors">Contact Us</Link></li>
                <li className="text-gray-600">Karachi, Pakistan</li>
                <li>
                  <a href="mailto:info@shopdarven.pk" className="text-gray-600 hover:text-gray-400 transition-colors">
                    info@shopdarven.pk
                  </a>
                </li>
              </ul>

              {/* Social Icons - Aligned Right */}
              <div className="flex items-center gap-6">
                <a href="https://www.instagram.com/shopdarven/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gray-500 transition-colors hover:scale-110 transform duration-200">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61580410082761" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gray-500 transition-colors hover:scale-110 transform duration-200">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-gray-200 pt-10 max-w-6xl mx-auto w-full">
            <p className="text-gray-400 text-base tracking-[0.2em] uppercase font-light">
              © {new Date().getFullYear()} DARVEN. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Nav Controls */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {currentSlideIndex > 0 && (
          <button onClick={handlePrevSlide} className="p-2.5 bg-white bg-opacity-90 hover:bg-opacity-100 text-black rounded-full transition-all" aria-label="Previous slide">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlideIndex === i ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
        {currentSlideIndex < totalSlides - 1 && (
          <button onClick={handleNextSlide} className="p-2.5 bg-white bg-opacity-90 hover:bg-opacity-100 text-black rounded-full transition-all" aria-label="Next slide">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}