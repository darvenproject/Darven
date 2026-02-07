'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { apiClient, getImageUrl } from '@/lib/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  material: string
  fabric_category?: string
  size: string
  color?: string
  images: string[]
  stock: number
}

export default function ReadyMadePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const fabricCategories = ['All', 'Wash n Wear', 'Blended', 'Boski', 'Soft Cotton', 'Giza Moon Cotton']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getReadyMadeProducts()
      console.log('Ready-made products response:', response.data)
      console.log('First product image:', response.data[0]?.images)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products
    }
    return products.filter(product => product.fabric_category === selectedCategory)
  }, [products, selectedCategory])

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
        Ready Made Collection
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

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-xl">
            {selectedCategory === 'All' 
              ? 'No products available at the moment'
              : `No products available in ${selectedCategory} category`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/ready-made/${product.id}`}>
                <div className="bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain bg-gray-50 dark:bg-gray-900 group-hover:scale-105 transition-transform duration-500"
                      priority={index < 4}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <p className="hidden sm:block text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                      <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Rs {product.price.toLocaleString()}
                      </span>
                      
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{product.material}</span>
                        <span className="mx-1 sm:mx-2">•</span>
                        <span>{product.size}</span>
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
