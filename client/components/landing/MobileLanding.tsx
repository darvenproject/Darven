'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { apiClient, getImageUrl } from '@/lib/api'

interface LandingImage {
  category: string
  image_url: string
  title: string
  link: string
}

export default function MobileLanding() {
  const [images, setImages] = useState<LandingImage[]>([
    { category: 'ready-made', image_url: '/placeholder-ready.jpg', title: 'Ready Made', link: '/ready-made' },
    { category: 'stitch-your-own', image_url: '/placeholder-stitch.jpg', title: 'Stitch Your Own Suit', link: '/stitch-your-own' },
    { category: 'fabric', image_url: '/placeholder-fabric.jpg', title: 'Fabric', link: '/fabric' },
  ])
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    fetchLandingImages()
  }, [])

  const fetchLandingImages = async () => {
    try {
      const response = await apiClient.getLandingImages()
      if (response.data && response.data.length > 0) {
        setImages(response.data)
      }
    } catch (error) {
      console.log('Using default images')
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    
    const currentY = e.touches[0].clientY
    const diff = startY.current - currentY
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
      isDragging.current = false
    }
  }

  const handleTouchEnd = () => {
    isDragging.current = false
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
      >
        {images.map((item, index) => (
          <Link
            key={item.category}
            href={item.link}
            className="h-screen w-full block relative"
          >
            {/* Image */}
            <div className="absolute inset-0 bg-gray-300 dark:bg-dark-surface">
              <div className="relative h-full w-full">
                <Image
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-4xl font-bold text-center px-4">
                {item.title}
              </h2>
            </div>

            {/* Swipe indicator */}
            {index < images.length - 1 && currentIndex === index && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm animate-bounce">
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
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index
                ? 'bg-white w-8'
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
