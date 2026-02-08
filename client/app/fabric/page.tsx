'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient, getImageUrl } from '@/lib/api'

interface Fabric {
  id: number
  name: string
  description: string
  price_per_meter: number
  material: string
  fabric_category?: string
  colors?: string[]
  images: string[]
  stock_meters: number
}

export default function FabricPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const fabricCategories = ['All', 'Wash n Wear', 'Blended', 'Boski', 'Soft Cotton', 'Giza Moon Cotton']

  useEffect(() => {
    fetchFabrics()
  }, [])

  const fetchFabrics = async () => {
    try {
      const response = await apiClient.getFabrics()
      console.log('Fabrics response:', response.data)
      setFabrics(response.data)
    } catch (error) {
      console.error('Error fetching fabrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFabrics = useMemo(() => {
    if (selectedCategory === 'All') {
      return fabrics
    }
    return fabrics.filter(fabric => fabric.fabric_category === selectedCategory)
  }, [fabrics, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Premium Fabrics
      </h1>

      {/* Filter Tabs */}
      <div className="mb-6 sm:mb-8 overflow-x-auto">
        <div className="flex gap-2 sm:gap-3 pb-2">
          {fabricCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredFabrics.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl">
            {selectedCategory === 'All' 
              ? 'No fabrics available at the moment'
              : `No fabrics available in ${selectedCategory} category`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredFabrics.map((fabric, index) => (
            <motion.div
              key={fabric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/fabric/${fabric.id}`}>
                <div className="bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* Use regular img tag instead of Next.js Image */}
                    <img
                      src={getImageUrl(fabric.images[0]) || '/placeholder.jpg'}
                      alt={fabric.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onLoad={(e) => {
                        e.currentTarget.classList.add('loaded')
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image for fabric ${fabric.id}`)
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
                    
                    {fabric.colors && fabric.colors.length > 0 && (
                      <div className="mb-2 sm:mb-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Colors: {fabric.colors.length}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {fabric.colors.slice(0, 3).map((color, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded"
                            >
                              {color}
                            </span>
                          ))}
                          {fabric.colors.length > 3 && (
                            <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                              +{fabric.colors.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
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