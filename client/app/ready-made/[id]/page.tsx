'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiCheck, FiPackage, FiTruck, FiX, FiInfo } from 'react-icons/fi'
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

interface SizeChartData {
  size: string
  collar: number
  shoulder: number
  chest: number
  sleeves: number
  length: number
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
  const [showSizeChart, setShowSizeChart] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

  // Size chart data from your backend
  const kameezSizeChart: SizeChartData[] = [
    { size: 'XS', collar: 14.5, shoulder: 17, chest: 22, sleeves: 23, length: 39 },
    { size: 'S', collar: 15, shoulder: 17.5, chest: 23, sleeves: 23.5, length: 40 },
    { size: 'M', collar: 16, shoulder: 18.5, chest: 24, sleeves: 24.25, length: 42 },
    { size: 'L', collar: 17, shoulder: 19.5, chest: 25, sleeves: 25, length: 43 },
    { size: 'XL', collar: 18, shoulder: 20.5, chest: 27, sleeves: 25.5, length: 44 },
  ]

  const shalwarSizeChart = [
    { size: 'XS', length: 39 },
    { size: 'S', length: 40 },
    { size: 'M', length: 42 },
    { size: 'L', length: 43 },
    { size: 'XL', length: 44 },
  ]

  const pajamaSizeChart = [
    { size: 'XS', length: 37, waist: 27, hips: 38 },
    { size: 'S', length: 38, waist: 29, hips: 39 },
    { size: 'M', length: 39, waist: 31, hips: 40 },
    { size: 'L', length: 40, waist: 33, hips: 42 },
    { size: 'XL', length: 41, waist: 34, hips: 44 },
  ]

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
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Size Chart</h2>
              <button
                onClick={() => setShowSizeChart(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Kameez Size Chart */}
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Kameez Measurements
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-900 dark:bg-white">
                        <th className="px-4 py-3 text-left text-sm font-black text-white dark:text-gray-900">Size</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Collar</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Shoulder</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Chest</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Sleeves</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kameezSizeChart.map((row, index) => (
                        <tr
                          key={row.size}
                          className={`${
                            index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-dark-surface'
                          } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <td className="px-4 py-3 text-left font-black text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                            {row.size}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.collar}"</td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.shoulder}"</td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.chest}"</td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.sleeves}"</td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.length}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shalwar Size Chart */}
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Shalwar Measurements
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-900 dark:bg-white">
                        <th className="px-4 py-3 text-left text-sm font-black text-white dark:text-gray-900">Size</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shalwarSizeChart.map((row, index) => (
                        <tr
                          key={row.size}
                          className={`${
                            index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-dark-surface'
                          } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <td className="px-4 py-3 text-left font-black text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                            {row.size}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.length}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pajama Size Chart */}
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPackage className="w-5 h-5" />
                  Pajama Measurements
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-900 dark:bg-white">
                        <th className="px-4 py-3 text-left text-sm font-black text-white dark:text-gray-900">Size</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Length</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Waist</th>
                        <th className="px-4 py-3 text-center text-sm font-black text-white dark:text-gray-900">Hips</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pajamaSizeChart.map((row, index) => (
                        <tr
                          key={row.size}
                          className={`${
                            index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-dark-surface'
                          } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <td className="px-4 py-3 text-left font-black text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                            {row.size}
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.length}"</td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.waist}"</td>
                          <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-bold">{row.hips}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measurement Guide */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FiInfo className="w-5 h-5" />
                  How to Measure
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-2">For Kameez:</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Collar:</strong> Measure around the base of your neck</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Shoulder:</strong> Measure from shoulder point to shoulder point across the back</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Chest:</strong> Measure around the fullest part of your chest</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Sleeves:</strong> Measure from shoulder to wrist</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Length:</strong> Measure from shoulder to desired length</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white mb-2">For Pajama:</p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Length:</strong> Measure from waist to ankle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Waist:</strong> Measure around your natural waistline</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-black text-gray-900 dark:text-white mt-0.5">•</span>
                        <span><strong className="font-black">Hips:</strong> Measure around the fullest part of your hips</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-600 dark:text-gray-400 italic">
                  * All measurements are in inches. For best results, have someone help you measure.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-black text-gray-900 dark:text-white">
                  Select Size <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline flex items-center gap-1 transition-colors"
                >
                  <FiInfo className="w-4 h-4" />
                  Size Chart
                </button>
              </div>
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