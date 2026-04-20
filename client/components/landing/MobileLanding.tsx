'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiClient, getImageUrl } from '@/lib/api'
import { useScrollContainer } from '@/context/ScrollContext'
import { motion } from 'framer-motion';

interface LandingImage {
  id?: number
  category: string
  image_url: string
  portrait_image_url?: string
  title: string
  link?: string
}

export default function MobileLanding() {
  const { scrollContainerRef } = useScrollContainer()

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

  useEffect(() => { fetchLandingImages() }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      setCurrentIndex(Math.round(container.scrollTop / window.innerHeight))
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  useEffect(() => {
    const totalSections = (heroImages.length > 0 ? 1 : 0) + sectionImages.length + 1
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (currentIndex < totalSections - 1)
          scrollContainerRef.current?.scrollTo({ top: (currentIndex + 1) * window.innerHeight, behavior: 'smooth' })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (currentIndex > 0)
          scrollContainerRef.current?.scrollTo({ top: (currentIndex - 1) * window.innerHeight, behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, heroImages.length, sectionImages.length, scrollContainerRef])

  useEffect(() => {
    if (heroImages.length <= 1 || currentIndex !== 0) return
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length, currentIndex])

  const handleHeroTouchStart = (e: React.TouchEvent) => setHeroTouchStart(e.targetTouches[0].clientX)
  const handleHeroTouchMove = (e: React.TouchEvent) => setHeroTouchEnd(e.targetTouches[0].clientX)
  const handleHeroTouchEnd = () => {
    if (!heroTouchStart || !heroTouchEnd) return
    const distance = heroTouchStart - heroTouchEnd
    if (distance > 50) setCurrentHeroIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1))
    else if (distance < -50) setCurrentHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))
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
    if (currentIndex < totalSections - 1)
      scrollContainerRef.current?.scrollTo({ top: (currentIndex + 1) * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>

      {/* Hero */}
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
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <div className="absolute inset-0" style={{ backgroundColor: '#1a1a1a' }}>
                  <div className="relative h-full w-full">
                    <Image src={getImageUrl(imageUrl)} alt={heroImage.title || 'Hero Image'} fill sizes="100vw" priority={index === 0} loading="eager" className="object-cover" unoptimized />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30" />
              </div>
            )
          })}

          {heroImages.length > 1 && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {heroImages.map((_, index) => (
                <div key={index} className={`h-1.5 rounded-full transition-all ${currentHeroIndex === index ? 'bg-white w-6' : 'bg-white bg-opacity-40 w-1.5'}`} />
              ))}
            </div>
          )}

          {currentIndex === 0 && (
            <button onClick={scrollToNext} className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce z-20" aria-label="Scroll down">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Categories */}
      {sectionImages.map((item, index) => {
        const imageUrl = item.portrait_image_url || item.image_url
        return (
          <Link key={`${item.category}-${index}`} href={item.link!} className="h-screen w-full snap-start snap-always block relative">
            <div className="absolute inset-0" style={{ backgroundColor: '#2a2a2a' }}>
              <div className="relative h-full w-full">
                <Image src={getImageUrl(imageUrl)} alt={item.title} fill sizes="100vw" priority className="object-cover" unoptimized />
              </div>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          </Link>
        )
      })}

      {/* Slide 5: Footer */}
      <div className="h-screen w-full snap-start snap-always bg-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center w-full px-8 flex flex-col items-center justify-center"
        >
          {/* Large Brand Title */}
          <h2 className="text-5xl font-bold mb-6 tracking-[0.15em] text-black">DARVEN</h2>
          
          {/* Description / Tagline */}
          <p className="text-base font-light text-gray-500 leading-relaxed max-w-[300px] mb-12">
            Premium quality kurta pajama and shalwar kameez for the modern Pakistani gentleman.
          </p>

          {/* Spread Content Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-16 text-left w-full max-w-[360px]">
            
            {/* Shop Column (Left Aligned) */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold tracking-widest text-black mb-5 uppercase border-b-2 border-black pb-1 w-fit">
                Shop
              </h3>
              <ul className="space-y-4">
                <li><Link href="/ready-made" className="text-base font-semibold text-gray-800">Ready Made</Link></li>
                <li><Link href="/stitch-your-own" className="text-base font-semibold text-gray-800">Stitch Your Own</Link></li>
                <li><Link href="/fabric" className="text-base font-semibold text-gray-800">Fabrics</Link></li>
                <li><Link href="/cart" className="text-base font-semibold text-gray-800">Cart</Link></li>
                <li><Link href="/about" className="text-base font-semibold text-gray-800">About Us</Link></li>
                <li><Link href="/size-chart" className="text-base font-semibold text-gray-800">Size Chart</Link></li>
                <li><Link href="/return-exchange-policy" className="text-base font-semibold text-gray-800">Return & Policy</Link></li>
              </ul>
            </div>

            {/* Contact Column (Right Aligned) */}
            <div className="flex flex-col items-end text-right">
              <h3 className="text-lg font-bold tracking-widest text-black mb-5 uppercase border-b-2 border-black pb-1 w-fit">
                Contact
              </h3>
              <ul className="space-y-4 mb-8">
                <li><Link href="/contact" className="text-base font-semibold text-gray-800">Contact Us</Link></li>
                <li className="text-base font-medium text-gray-500">Karachi, Pakistan</li>
                <li>
                  <a href="mailto:info@shopdarven.pk" className="text-base font-medium text-gray-500 break-all">
                    info@shopdarven.pk
                  </a>
                </li>
              </ul>
              
              {/* Social Icons - Aligned Right */}
              <div className="flex items-center gap-6 mt-auto">
                <a href="https://www.instagram.com/shopdarven/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61580410082761" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-200 pt-8 w-full max-w-[320px]">
            <p className="text-gray-400 text-xs tracking-widest uppercase font-light">
              © {new Date().getFullYear()} DARVEN. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Nav Dots */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-white w-8' : 'bg-white bg-opacity-40 w-2'}`} />
        ))}
      </div>
    </div>
  )
}