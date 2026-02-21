'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiPackage, FiLayers } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'

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

export default function FabricDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [fabric, setFabric] = useState<Fabric | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [length, setLength] = useState(2.5)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchFabric()
  }, [params.id])

  const fetchFabric = async () => {
    try {
      const response = await apiClient.getFabric(params.id as string)
      setFabric(response.data)
    } catch (error) {
      console.error('Error fetching fabric:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!fabric) return
    
    const totalPrice = fabric.price_per_meter * length
    
    addItem({
      id: `fabric-${fabric.id}-${length}`,
      type: 'fabric',
      name: fabric.name,
      price: totalPrice,
      quantity: quantity,
      image: fabric.images[0],
      details: {
        material: fabric.material,
        length: length,
        price_per_meter: fabric.price_per_meter
      }
    })
    
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white"></div>
      </div>
    )
  }

  if (!fabric) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Fabric not found</h2>
          <Link href="/fabric" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold">
            ← Back to fabrics
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = fabric.price_per_meter * length

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/fabric" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold">
              Fabrics
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-bold">{fabric.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* LEFT: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <img
                src={getImageUrl(fabric.images[selectedImage]) || '/placeholder.jpg'}
                alt={fabric.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {fabric.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {fabric.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                      selectedImage === index
                        ? 'border-gray-900 dark:border-white scale-105 shadow-lg'
                        : 'border-gray-300 dark:border-gray-800 hover:border-gray-500 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${fabric.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {fabric.name}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {fabric.description}
              </p>
            </div>
            
            {/* Price */}
            <div className="py-6 border-y border-gray-200 dark:border-gray-800">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                Rs {fabric.price_per_meter.toLocaleString()}
              </span>
              <span className="text-2xl text-gray-500 dark:text-gray-400 font-bold">/meter</span>
            </div>
            
            {/* Product Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Material</span>
                </div>
                <span className="text-base font-black text-gray-900 dark:text-white">{fabric.material}</span>
              </div>

              {fabric.fabric_category && (
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <FiLayers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Category</span>
                  </div>
                  <span className="text-base font-black text-gray-900 dark:text-white">{fabric.fabric_category}</span>
                </div>
              )}
            </div>

            {/* Colors */}
            {fabric.colors && fabric.colors.length > 0 && (
              <div>
                <label className="block text-lg font-black text-gray-900 dark:text-white mb-3">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {fabric.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 dark:bg-dark-surface border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-black text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-600 hover:scale-105 transition-all"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-600 dark:text-gray-400">Stock Available</span>
                <span className={`text-lg font-black ${fabric.stock_meters > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {fabric.stock_meters > 0 ? `${fabric.stock_meters} meters` : 'Out of stock'}
                </span>
              </div>
            </div>
            
            {/* Length Selection */}
            <div>
              <label className="block text-lg font-black text-gray-900 dark:text-white mb-3">
                Select Length (meters)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLength(Math.max(0.5, length - 0.5))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  step="0.5"
                  min="0.5"
                  className="w-24 text-center text-xl font-black text-gray-900 dark:text-white bg-white dark:bg-dark-bg border-2 border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900 dark:focus:border-white hover:border-gray-400 dark:hover:border-gray-600 transition-all"
                />
                
                <button
                  onClick={() => setLength(length + 0.5)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800"
                  disabled={fabric.stock_meters > 0 && length >= fabric.stock_meters}
                >
                  <FiPlus className="w-4 h-4" />
                </button>
                
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">meters</span>
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <label className="block text-lg font-black text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                
                <span className="text-2xl font-black text-gray-900 dark:text-white min-w-[40px] text-center">
                  {quantity}
                </span>
                
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="p-6 bg-gray-50 dark:bg-dark-surface rounded-2xl border-2 border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Price per meter:</span>
                <span className="text-base font-black text-gray-900 dark:text-white">
                  Rs {fabric.price_per_meter.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Length:</span>
                <span className="text-base font-black text-gray-900 dark:text-white">{length}m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Quantity:</span>
                <span className="text-base font-black text-gray-900 dark:text-white">{quantity}</span>
              </div>
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900 dark:text-white">Total:</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    Rs {(totalPrice * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={fabric.stock_meters === 0}
              className="w-full py-3 md:py-5 px-4 md:px-8 rounded-xl font-black text-base md:text-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 hover:shadow-2xl hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3"
            >
              <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {fabric.stock_meters > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}