'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  const images = [
    { src: '/assets/about/1.png', alt: 'About Us Image 1' },
    { src: '/assets/about/2.png', alt: 'About Us Image 2' },
    { src: '/assets/about/3.png', alt: 'About Us Image 3' },
    { src: '/assets/about/4.png', alt: 'About Us Image 4' },
    { src: '/assets/about/5.png', alt: 'About Us Image 5' },
    { src: '/assets/about/6.png', alt: 'About Us Image 6' },
    { src: '/assets/about/7.png', alt: 'About Us Image 7' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button & Title */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-light text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-gray-900 text-center mb-8 sm:mb-12">
          ABOUT US
        </h1>
      </div>

      {/* Full-width Images */}
      <div className="flex flex-col w-full">
        {images.map((image, index) => (
          <div key={index} className="relative w-full">
            <Image
              src={image.src}
              alt={image.alt}
              width={1600}
              height={1067}
              className="w-full h-auto block"
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
