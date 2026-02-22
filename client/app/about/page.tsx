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
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-light"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 text-center mb-16">
          ABOUT US
        </h1>
        
        <div className="flex flex-col gap-8">
          {images.map((image, index) => (
            <div key={index} className="relative w-full">
              <Image
                src={image.src}
                alt={image.alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
