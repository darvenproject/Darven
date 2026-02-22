'use client'

import { useEffect, useState, useMemo } from 'react'
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
  
  const fabricCategories = ['All', 'Wash n Wear', 'Boski', 'Soft Cotton', 'Giza Moon Cotton']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await apiClient.getReadyMadeProducts()
      console.log('Ready-made products response:', response.data)
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-3 tracking-tight">
            Ready Made Collection
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 py-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {fabricCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">
              No products available
            </p>
            <p className="text-gray-600">
              {selectedCategory === 'All' 
                ? 'Check back soon for new arrivals'
                : `No products in ${selectedCategory} category`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/ready-made/${product.id}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-gray-900:border-white hover:-translate-y-2">
                    {/* Image Container - Fixed Height */}
                    <div className="relative h-[400px] overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(product.images[0]) || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading={index < 8 ? 'eager' : 'lazy'}
                        onLoad={(e) => e.currentTarget.classList.add('loaded')}
                        onError={(e) => {
                          console.error(`Failed to load image for product ${product.id}`)
                          e.currentTarget.src = '/placeholder.jpg'
                        }}
                      />
                      
                      {/* Stock Badge */}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <div className="bg-white px-6 py-3 rounded-xl">
                            <span className="text-gray-900 font-black text-sm">Out of Stock</span>
                          </div>
                        </div>
                      )}

                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 bg-gray-50 group-hover:bg-white:bg-gray-800 transition-colors">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-600:text-gray-300 transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      {/* Price & Details */}
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <span className="text-2xl font-black text-gray-900">
                            Rs {product.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-gray-500">
                              {product.material}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs font-bold text-gray-500">
                              {product.size}
                            </span>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-900:bg-white transition-all group-hover:scale-110">
                          <svg className="w-5 h-5 text-gray-900 group-hover:text-white:text-gray-900 transition-colors group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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
    </div>
  )
}