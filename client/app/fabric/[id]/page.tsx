'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FiShoppingCart, FiMinus, FiPlus, FiPackage, FiLayers, FiShield, FiRefreshCw, FiTruck, FiCheck } from 'react-icons/fi'
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

const getLovedByCount = (id: number) => {
  const base = (id * 211 + 55) % 500
  return Math.max(60, base + 120)
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

  useEffect(() => { fetchFabric() }, [params.id])

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
      details: { material: fabric.material, length: length, price_per_meter: fabric.price_per_meter }
    })
    router.push('/cart')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div></div>

  if (!fabric) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Fabric not found</h2>
        <Link href="/fabric" className="text-gray-600 hover:text-gray-900 font-bold">← Back to fabrics</Link>
      </div>
    </div>
  )

  const totalPrice = fabric.price_per_meter * length
  const lovedByCount = getLovedByCount(fabric.id)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/fabric" className="text-gray-600 hover:text-gray-900 font-bold">Fabrics</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-bold">{fabric.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
              <img src={getImageUrl(fabric.images[selectedImage]) || '/placeholder.jpg'} alt={fabric.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }} />
            </div>
            {fabric.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {fabric.images.map((image, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`relative h-24 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${selectedImage === index ? 'border-gray-900 scale-105 shadow-lg' : 'border-gray-300 hover:border-gray-500 hover:shadow-md'}`}>
                    <img src={getImageUrl(image)} alt={`${fabric.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">{fabric.name}</h1>

              {/* Loved by badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-3">
                <span className="text-red-500 text-base">♥</span>
                <span className="text-sm font-bold text-red-600">Loved by {lovedByCount} shoppers</span>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">{fabric.description}</p>
            </div>

            <div className="py-6 border-y border-gray-200">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">Rs {fabric.price_per_meter.toLocaleString()}</span>
              <span className="text-lg sm:text-xl lg:text-2xl text-gray-500 font-bold">/meter</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200"><div className="flex items-center gap-2 mb-2"><FiPackage className="w-5 h-5 text-gray-600" /><span className="text-sm font-bold text-gray-600">Material</span></div><span className="text-base font-black text-gray-900">{fabric.material}</span></div>
              {fabric.fabric_category && <div className="p-4 bg-gray-50 rounded-xl border border-gray-200"><div className="flex items-center gap-2 mb-2"><FiLayers className="w-5 h-5 text-gray-600" /><span className="text-sm font-bold text-gray-600">Category</span></div><span className="text-base font-black text-gray-900">{fabric.fabric_category}</span></div>}
            </div>

            {fabric.colors && fabric.colors.length > 0 && (
              <div>
                <label className="block text-lg font-black text-gray-900 mb-3">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {fabric.colors.map((color, index) => (<span key={index} className="px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-xl text-sm font-black text-gray-900 hover:border-gray-400 hover:scale-105 transition-all">{color}</span>))}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-600">Stock Available</span>
                <span className={`text-lg font-black ${fabric.stock_meters > 0 ? 'text-green-600' : 'text-red-600'}`}>{fabric.stock_meters > 0 ? `${fabric.stock_meters} meters` : 'Out of stock'}</span>
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="block text-lg font-black text-gray-900 mb-3">Select Length (meters)</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setLength(Math.max(0.5, length - 0.5))} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900 hover:text-white transition-all hover:scale-110 border-2 border-gray-200 hover:border-gray-900"><FiMinus className="w-4 h-4" /></button>
                <input type="number" value={length} onChange={(e) => setLength(Math.max(0.5, parseFloat(e.target.value) || 0.5))} step="0.5" min="0.5" className="w-24 text-center text-xl font-black text-gray-900 bg-white border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900 transition-all" />
                <button onClick={() => setLength(length + 0.5)} disabled={fabric.stock_meters > 0 && length >= fabric.stock_meters} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900 hover:text-white transition-all hover:scale-110 border-2 border-gray-200 hover:border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-gray-100"><FiPlus className="w-4 h-4" /></button>
                <span className="text-sm font-bold text-gray-600">meters</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-lg font-black text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900 hover:text-white transition-all hover:scale-110 border-2 border-gray-200 hover:border-gray-900"><FiMinus className="w-4 h-4" /></button>
                <span className="text-2xl font-black text-gray-900 min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900 hover:text-white transition-all hover:scale-110 border-2 border-gray-200 hover:border-gray-900"><FiPlus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-600">Price per meter:</span><span className="text-base font-black text-gray-900">Rs {fabric.price_per_meter.toLocaleString()}</span></div>
              <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-600">Length:</span><span className="text-base font-black text-gray-900">{length}m</span></div>
              <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-600">Quantity:</span><span className="text-base font-black text-gray-900">{quantity}</span></div>
              <div className="border-t-2 border-gray-200 pt-3 mt-3"><div className="flex justify-between items-center"><span className="text-xl font-black text-gray-900">Total:</span><span className="text-3xl font-black text-gray-900">Rs {(totalPrice * quantity).toLocaleString()}</span></div></div>
            </div>

            {/* Add to Cart */}
            <button onClick={handleAddToCart} disabled={fabric.stock_meters === 0} className="w-full py-3 md:py-5 px-4 md:px-8 rounded-xl font-black text-base md:text-lg bg-gray-900 text-white hover:bg-black hover:shadow-2xl hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3">
              <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {fabric.stock_meters > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200"><FiShield className="w-6 h-6 text-gray-700" /><span className="text-xs font-bold text-gray-700 text-center">Secure Checkout</span></div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200"><FiRefreshCw className="w-6 h-6 text-gray-700" /><span className="text-xs font-bold text-gray-700 text-center">7-Day Returns</span></div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200"><FiTruck className="w-6 h-6 text-gray-700" /><span className="text-xs font-bold text-gray-700 text-center">Fast Delivery</span></div>
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
                      <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center">{step.icon}</div>
                      <span className="text-xs font-bold text-gray-600 text-center max-w-[60px] leading-tight">{step.label}</span>
                    </div>
                    {index < arr.length - 1 && <div className="flex-1 mx-1 mb-5"><div className="h-0.5 bg-gray-300 w-full" style={{ minWidth: '12px' }} /></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Return Policy */}
            <div className="border-2 border-gray-200 rounded-2xl p-5">
              <p className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2"><FiRefreshCw className="w-4 h-4" />Return & Exchange Policy</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Returns accepted within <strong>7 days</strong> of receiving order</span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Item must be unused and in original condition</span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Exchange fee of <strong>PKR 250</strong> applies</span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Refunds valid for orders up to <strong>Rs. 10,000</strong></span></li>
                <li className="flex items-start gap-2"><FiCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /><span>Return shipping is customer's responsibility</span></li>
              </ul>
              <Link href="/return-exchange-policy" className="inline-block mt-3 text-xs font-bold text-gray-500 hover:text-gray-900 underline transition-colors">View full policy →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}