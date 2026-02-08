'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
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
  const [length, setLength] = useState(2.5) // Default 2.5 meters
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  if (!fabric) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fabric not found</h2>
          <Link href="/fabric" className="text-blue-600 hover:underline">
            Back to fabrics
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = fabric.price_per_meter * length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative h-[500px] mb-4 rounded-lg overflow-hidden">
            <Image
              src={imageError ? '/placeholder.jpg' : getImageUrl(fabric.images[selectedImage])}
              alt={fabric.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
          
          {fabric.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {fabric.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-gray-900 dark:border-white'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${fabric.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                    }}
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {fabric.name}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            {fabric.description}
          </p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              Rs {fabric.price_per_meter.toLocaleString()}/meter
            </span>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 w-24">Material:</span>
              <span className="text-gray-900 dark:text-white font-medium">{fabric.material}</span>
            </div>
            
            {fabric.fabric_category && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 w-24">Category:</span>
                <span className="text-gray-900 dark:text-white font-medium">{fabric.fabric_category}</span>
              </div>
            )}
            
            {fabric.colors && fabric.colors.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 w-24">Colors:</span>
                <div className="flex flex-wrap gap-2">
                  {fabric.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 w-24">Stock:</span>
              <span className={`font-medium ${fabric.stock_meters > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fabric.stock_meters > 0 ? `${fabric.stock_meters} meters available` : 'Out of stock'}
              </span>
            </div>
          </div>
          
          {/* Length Selection */}
          <div className="mb-6">
            <label className="block text-gray-600 dark:text-gray-400 mb-2">
              Length (meters)
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLength(Math.max(0.5, length - 0.5))}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMinus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                step="0.5"
                min="0.5"
                className="w-24 text-center text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-white"
              />
              
              <button
                onClick={() => setLength(length + 0.5)}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                disabled={fabric.stock_meters > 0 && length >= fabric.stock_meters}
              >
                <FiPlus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              
              <span className="text-gray-600 dark:text-gray-400">meters</span>
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-gray-600 dark:text-gray-400 mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMinus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
              
              <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiPlus className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
          
          {/* Total Price */}
          <div className="mb-6 p-4 bg-gray-100 dark:bg-dark-surface rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Price per meter:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                Rs {fabric.price_per_meter.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Length:</span>
              <span className="text-gray-900 dark:text-white font-medium">{length}m</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
              <span className="text-gray-900 dark:text-white font-medium">{quantity}</span>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 mt-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  Rs {(totalPrice * quantity).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={fabric.stock_meters === 0}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiShoppingCart className="w-6 h-6" />
            {fabric.stock_meters > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
