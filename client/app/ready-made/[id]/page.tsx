'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi'
import { apiClient, getImageUrl } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'

interface Product {
  id: number
  name: string
  description: string
  price: number
  material: string
  size: string
  color?: string
  images: string[]
  stock: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const addItem = useCartStore((state) => state.addItem)
  
  // Available colors for all products
  const availableColors = ['Jet Black', 'Navy Blue', 'Milky White', 'Grey', 'Dark Purple']
  
  // Available sizes for ready-made products
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await apiClient.getReadyMadeProduct(params.id as string)
      setProduct(response.data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await apiClient.getReadyMadeProducts()
      const filtered = response.data.filter((p: Product) => p.id !== parseInt(params.id as string))
      setRelatedProducts(filtered.slice(0, 4))
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Validate selections
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    if (!selectedColor) {
      alert('Please select a color')
      return
    }
    
    addItem({
      id: `ready-made-${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      type: 'ready-made',
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      details: {
        material: product.material,
        size: selectedSize,
        color: selectedColor
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link href="/ready-made" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 mb-12 sm:mb-20">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] max-h-[600px] mb-4 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Image
              src={getImageUrl(product.images[selectedImage])}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 bg-gray-50 dark:bg-gray-900 ${
                    selectedImage === index
                      ? 'border-gray-900 dark:border-white'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 33vw, 15vw"
                    loading="lazy"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {product.name}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-base sm:text-lg">
            {product.description}
          </p>
          
          <div className="mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Rs {product.price.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base">
              <span className="text-gray-600 dark:text-gray-400 w-20 sm:w-24">Material:</span>
              <span className="text-gray-900 dark:text-white font-medium">{product.material}</span>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 text-sm sm:text-base">
              <span className="text-gray-600 dark:text-gray-400 w-20 sm:w-24">Stock:</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
              Select Size <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                    selectedSize === size
                      ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-500 dark:hover:border-gray-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
              Select Color <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all text-left ${
                    selectedColor === color
                      ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-gray-500 dark:hover:border-gray-500'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-600 dark:text-gray-400 mb-2 text-sm sm:text-base">Quantity</label>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <FiMinus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
              </button>
              
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white w-10 sm:w-12 text-center">
                {quantity}
              </span>
              
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-gray-200 dark:bg-dark-surface rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                disabled={product.stock > 0 && quantity >= product.stock}
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </div>
          
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
            Related Products
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/ready-made/${relatedProduct.id}`}>
                <div className="bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={getImageUrl(relatedProduct.images[0])}
                      alt={relatedProduct.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      className="object-contain bg-gray-50 dark:bg-gray-900 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    
                    <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                      Rs {relatedProduct.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
