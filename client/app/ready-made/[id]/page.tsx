'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiCheck, FiPackage, FiTruck } from 'react-icons/fi'
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
  colors?: string[]
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
  
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await apiClient.getReadyMadeProduct(params.id as string)
      console.log('Product data:', response.data)
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
    
    const availableColors = product.colors || []
    
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    if (availableColors.length > 0 && !selectedColor) {
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
        color: selectedColor || 'N/A'
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link href="/ready-made" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold">
            ← Back to products
          </Link>
        </div>
      </div>
    )
  }

  const availableColors = product.colors || []

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/ready-made" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold">
              Ready Made
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          
          {/* LEFT: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <img
                src={getImageUrl(product.images[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                      selectedImage === index
                        ? 'border-gray-900 dark:border-white scale-105 shadow-lg'
                        : 'border-gray-300 dark:border-gray-800 hover:border-gray-500 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
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
                {product.name}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {/* Price */}
            <div className="py-6 border-y border-gray-200 dark:border-gray-800">
              <span className="text-5xl font-black text-gray-900 dark:text-white">
                Rs {product.price.toLocaleString()}
              </span>
            </div>
            
            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FiPackage className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Material</span>
                </div>
                <span className="text-base font-black text-gray-900 dark:text-white">{product.material}</span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FiTruck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Stock</span>
                </div>
                <span className={`text-base font-black ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-lg font-black text-gray-900 dark:text-white mb-3">
                Select Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-xl border-2 font-black transition-all hover:scale-105 ${
                      selectedSize === size
                        ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-105 shadow-lg'
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white hover:border-gray-500 dark:hover:border-gray-500 hover:shadow-md'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <label className="block text-lg font-black text-gray-900 dark:text-white mb-3">
                  Select Color <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-4 px-5 rounded-xl border-2 font-black transition-all text-left flex items-center justify-between hover:scale-105 ${
                        selectedColor === color
                          ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                          : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface text-gray-900 dark:text-white hover:border-gray-500 dark:hover:border-gray-500 hover:shadow-md'
                      }`}
                    >
                      <span>{color}</span>
                      {selectedColor === color && (
                        <FiCheck className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-lg font-black text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white"
                >
                  <FiMinus className="w-5 h-5" />
                </button>
                
                <span className="text-3xl font-black text-gray-900 dark:text-white min-w-[50px] text-center">
                  {quantity}
                </span>
                
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all hover:scale-110 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-800"
                  disabled={product.stock > 0 && quantity >= product.stock}
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full py-5 px-8 rounded-xl font-black text-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 hover:shadow-2xl hover:scale-105 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <FiShoppingCart className="w-6 h-6" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
              You Might Also Like
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/ready-made/${relatedProduct.id}`}>
                  <div className="group bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white hover:-translate-y-2">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <img
                        src={getImageUrl(relatedProduct.images[0])}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-dark-surface group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors">
                      <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      
                      <span className="text-xl font-black text-gray-900 dark:text-white">
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
    </div>
  )
}