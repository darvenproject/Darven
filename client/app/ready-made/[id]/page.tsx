'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiCheck, FiPackage, FiTruck, FiX, FiInfo, FiShield, FiRefreshCw } from 'react-icons/fi'
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

// Generate a stable random number based on product id
const getLovedByCount = (id: number) => {
  const base = (id * 137 + 42) % 800
  return Math.max(50, base + 100)
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
    if (!selectedSize) { alert('Please select a size'); return }
    if (availableColors.length > 0 && !selectedColor) { alert('Please select a color'); return }
    addItem({
      id: `ready-made-${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      type: 'ready-made',
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      details: { material: product.material, size: selectedSize, color: selectedColor || 'N/A' }
    })
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Product not found</h2>
          <Link href="/ready-made" className="text-gray-600 hover:text-gray-900 font-bold">← Back to products</Link>
        </div>
      </div>
    )
  }

  const availableColors = product.colors || []
  const lovedByCount = getLovedByCount(product.id)

  return (
    <div className="min-h-screen bg-white">
      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Size Chart</h2>
              <button onClick={() => setShowSizeChart(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiPackage className="w-5 h-5" />Kameez Measurements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-200 rounded-xl overflow-hidden">
                    <thead><tr className="bg-gray-900">{['Size','Collar','Shoulder','Chest','Sleeves','Length'].map(h=><th key={h} className="px-4 py-3 text-sm font-black text-white text-center first:text-left">{h}</th>)}</tr></thead>
                    <tbody>{kameezSizeChart.map((row,i)=><tr key={row.size} className={i%2===0?'bg-gray-50':'bg-white'}><td className="px-4 py-3 text-left font-black text-gray-900 border-r border-gray-200">{row.size}</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.collar}"</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.shoulder}"</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.chest}"</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.sleeves}"</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.length}"</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiPackage className="w-5 h-5" />Shalwar Measurements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-200 rounded-xl overflow-hidden">
                    <thead><tr className="bg-gray-900">{['Size','Length'].map(h=><th key={h} className="px-4 py-3 text-sm font-black text-white text-center first:text-left">{h}</th>)}</tr></thead>
                    <tbody>{shalwarSizeChart.map((row,i)=><tr key={row.size} className={i%2===0?'bg-gray-50':'bg-white'}><td className="px-4 py-3 text-left font-black text-gray-900 border-r border-gray-200">{row.size}</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.length}"</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiPackage className="w-5 h-5" />Pajama Measurements</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-2 border-gray-200 rounded-xl overflow-hidden">
                    <thead><tr className="bg-gray-900">{['Size','Length','Waist','Hips'].map(h=><th key={h} className="px-4 py-3 text-sm font-black text-white text-center first:text-left">{h}</th>)}</tr></thead>
                    <tbody>{pajamaSizeChart.map((row,i)=><tr key={row.size} className={i%2===0?'bg-gray-50':'bg-white'}><td className="px-4 py-3 text-left font-black text-gray-900 border-r border-gray-200">{row.size}</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.length}"</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.waist}"</td><td className="px-4 py-3 text-center text-gray-700 font-bold">{row.hips}"</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2"><FiInfo className="w-5 h-5" />How to Measure</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-black text-gray-900 mb-2">For Kameez:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[['Collar','Measure around the base of your neck'],['Shoulder','Measure from shoulder point to shoulder point across the back'],['Chest','Measure around the fullest part of your chest'],['Sleeves','Measure from shoulder to wrist'],['Length','Measure from shoulder to desired length']].map(([l,d])=><li key={l} className="flex items-start gap-2"><span className="font-black text-gray-900 mt-0.5">•</span><span><strong className="font-black">{l}:</strong> {d}</span></li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 mb-2">For Pajama:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[['Length','Measure from waist to ankle'],['Waist','Measure around your natural waistline'],['Hips','Measure around the fullest part of your hips']].map(([l,d])=><li key={l} className="flex items-start gap-2"><span className="font-black text-gray-900 mt-0.5">•</span><span><strong className="font-black">{l}:</strong> {d}</span></li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-600 italic">* All measurements are in inches. For best results, have someone help you measure.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/ready-made" className="text-gray-600 hover:text-gray-900 font-bold">Ready Made</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-200">
              <img src={getImageUrl(product.images[selectedImage])} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }} />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${selectedImage === index ? 'border-gray-900 scale-105 shadow-lg' : 'border-gray-300 hover:border-gray-500 hover:shadow-md'}`}>
                    <img src={getImageUrl(image)} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">{product.name}</h1>
              
              {/* Loved by badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-3">
                <span className="text-red-500 text-base">♥</span>
                <span className="text-sm font-bold text-red-600">Loved by {lovedByCount} shoppers</span>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="py-6 border-y border-gray-200">
              <span className="text-3xl sm:text-5xl font-black text-gray-900">Rs {product.price.toLocaleString()}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2"><FiPackage className="w-5 h-5 text-gray-600" /><span className="text-sm font-bold text-gray-600">Material</span></div>
                <span className="text-base font-black text-gray-900">{product.material}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2"><FiTruck className="w-5 h-5 text-gray-600" /><span className="text-sm font-bold text-gray-600">Stock</span></div>
                <span className={`text-base font-black ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-black text-gray-900">Select Size <span className="text-red-500">*</span></label>
                <button onClick={() => setShowSizeChart(true)} className="group px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-900 hover:to-gray-800 border-2 border-gray-300 hover:border-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="relative"><FiInfo className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" /><div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div></div>
                    <span className="text-sm font-black text-gray-700 group-hover:text-white transition-colors">Size Chart</span>
                  </div>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`py-3 px-4 rounded-xl border-2 font-black transition-all hover:scale-105 ${selectedSize === size ? 'border-gray-900 bg-gray-900 text-white scale-105 shadow-lg' : 'border-gray-300 bg-white text-gray-900 hover:border-gray-500 hover:shadow-md'}`}>{size}</button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <label className="block text-lg font-black text-gray-900 mb-3">Select Color <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {availableColors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`py-4 px-5 rounded-xl border-2 font-black transition-all text-left flex items-center justify-between hover:scale-105 ${selectedColor === color ? 'border-gray-900 bg-gray-900 text-white shadow-lg' : 'border-gray-300 bg-white text-gray-900 hover:border-gray-500 hover:shadow-md'}`}>
                      <span>{color}</span>
                      {selectedColor === color && <FiCheck className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-lg font-black text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900 hover:text-white transition-all hover:scale-110 border-2 border-gray-200 hover:border-gray-900"><FiMinus className="w-4 h-4" /></button>
                <span className="text-2xl font-black text-gray-900 min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={product.stock > 0 && quantity >= product.stock} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900 hover:text-white transition-all hover:scale-110 border-2 border-gray-200 hover:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-gray-100"><FiPlus className="w-4 h-4" /></button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full py-3 md:py-5 px-4 md:px-8 rounded-xl font-black text-base md:text-lg bg-gray-900 text-white hover:bg-black hover:shadow-2xl hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3">
              <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <FiShield className="w-6 h-6 text-gray-700" />
                <span className="text-xs font-bold text-gray-700 text-center">Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <FiRefreshCw className="w-6 h-6 text-gray-700" />
                <span className="text-xs font-bold text-gray-700 text-center">7-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <FiTruck className="w-6 h-6 text-gray-700" />
                <span className="text-xs font-bold text-gray-700 text-center">Fast Delivery</span>
              </div>
            </div>

            {/* Order Flow */}
            <div className="border-2 border-gray-200 rounded-2xl p-5 bg-gray-50">
              <p className="text-sm font-black text-gray-700 mb-4 text-center uppercase tracking-wider">How It Works</p>
              <div className="flex items-center justify-between">
                {[
                  { icon: <FiShoppingCart className="w-5 h-5" />, label: 'Add to Cart' },
                  { icon: <FiShield className="w-5 h-5" />, label: 'Checkout' },
                  { icon: <FiTruck className="w-5 h-5" />, label: 'Order Placed' },
                  { icon: <FiCheck className="w-5 h-5" />, label: 'Delivered' },
                ].map((step, index, arr) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center">
                        {step.icon}
                      </div>
                      <span className="text-xs font-bold text-gray-600 text-center max-w-[60px] leading-tight">{step.label}</span>
                    </div>
                    {index < arr.length - 1 && (
                      <div className="flex-1 mx-1 mb-5">
                        <div className="h-0.5 bg-gray-300 w-full" style={{ minWidth: '12px' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Return Policy Summary */}
            <div className="border-2 border-gray-200 rounded-2xl p-5">
              <p className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2"><FiRefreshCw className="w-4 h-4" />Return & Exchange Policy</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Returns accepted within <strong>7 days</strong> of receiving order</span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Item must be unworn, unwashed with original tags</span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Exchange fee of <strong>PKR 250</strong> applies</span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Refunds valid for orders up to <strong>Rs. 10,000</strong></span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Return shipping is customer's responsibility</span></li>
              </ul>
              <Link href="/return-exchange-policy" className="inline-block mt-3 text-xs font-bold text-gray-500 hover:text-gray-900 underline transition-colors">View full policy →</Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 tracking-tight">You Might Also Like</h2>
            <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4 min-w-max">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/ready-made/${rp.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-gray-900 hover:-translate-y-2 w-[280px]">
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img src={getImageUrl(rp.images[0])} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4 bg-gray-50 group-hover:bg-white transition-colors">
                        <h3 className="text-base font-black text-gray-900 mb-2 line-clamp-1">{rp.name}</h3>
                        <span className="text-lg font-black text-gray-900">Rs {rp.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/ready-made/${rp.id}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-gray-900 hover:-translate-y-2">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img src={getImageUrl(rp.images[0])} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4 bg-gray-50 group-hover:bg-white transition-colors">
                      <h3 className="text-base font-black text-gray-900 mb-2 line-clamp-1">{rp.name}</h3>
                      <span className="text-xl font-black text-gray-900">Rs {rp.price.toLocaleString()}</span>
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