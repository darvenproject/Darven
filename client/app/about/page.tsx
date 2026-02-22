'use client'

import Image from 'next/image'

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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 text-center mb-16">
          ABOUT US
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {images.map((image, index) => (
            <div key={index} className="relative w-full aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 14vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
