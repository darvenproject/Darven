'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient, getImageUrl } from '@/lib/api'

interface Fabric {
  id: number
  name: string
  description: string
  price_per_meter: number
  material: string
  images: string[]
  stock_meters: number
}

export default function FabricPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFabrics()
  }, [])

  const fetchFabrics = async () => {
    try {
      const response = await apiClient.getFabrics()
      setFabrics(response.data)
    } catch (error) {
      console.error('Error fetching fabrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const memoizedFabrics = useMemo(() => fabrics, [fabrics])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
        Premium Fabrics
      </h1>

      {fabrics.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl">
            No fabrics available at the moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {memoizedFabrics.map((fabric, index) => (
            <motion.div
              key={fabric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/fabric/${fabric.id}`}>
                <div className="bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={getImageUrl(fabric.images[0])}
                      alt={fabric.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                    {fabric.stock_meters === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-1">
                      {fabric.name}
                    </h3>
                    
                    <p className="hidden sm:block text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {fabric.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Rs {fabric.price_per_meter.toLocaleString()}/m
                      </span>
                      
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{fabric.material}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
