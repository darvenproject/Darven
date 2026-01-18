'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient, getImageUrl } from '@/lib/api'

interface LandingImage {
  category: string
  image_url: string
  title: string
  link: string
}

export default function DesktopLanding() {
  const [images, setImages] = useState<LandingImage[]>([
    { category: 'ready-made', image_url: '/placeholder-ready.jpg', title: 'Ready Made', link: '/ready-made' },
    { category: 'stitch-your-own', image_url: '/placeholder-stitch.jpg', title: 'Stitch Your Own Suit', link: '/stitch-your-own' },
    { category: 'fabric', image_url: '/placeholder-fabric.jpg', title: 'Fabric', link: '/fabric' },
  ])

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

  return (
    <div className="h-full flex gap-0 overflow-hidden">
      {images.map((item, index) => (
        <Link
          key={item.category}
          href={item.link}
          className="flex-1 relative group overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
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
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-4xl md:text-5xl font-bold text-center px-4 group-hover:scale-110 transition-transform duration-300">
                {item.title}
              </h2>
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </motion.div>
        </Link>
      ))}
    </div>
  )
}
