'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiPackage, FiScissors, FiCheck } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { apiClient } from '@/lib/api'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

interface CustomerDetails {
  customer_name: string
  phone: string
  address: string
  postal_code: string
  city: string
  state: string
  landmark: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)

  const [details, setDetails] = useState<CustomerDetails>({
    customer_name: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    state: '',
    landmark: '',
  })

  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0 && !showSuccess) {
      router.push('/cart')
    }
  }, [mounted, items.length, showSuccess, router])

  const subtotal = getTotalPrice()
  
  // Calculate stitching cost
  const customItems = items.filter(item => item.type === 'custom')
  const totalStitchingCost = customItems.reduce((total, item) => total + (3500 * item.quantity), 0)
  
  const deliveryCharges = 200
  const total = subtotal + totalStitchingCost + deliveryCharges

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setDetails({ ...details, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        ...details,
        items: items.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          details: item.details,
        })),
        subtotal,
        stitching_cost: totalStitchingCost,
        delivery_charges: deliveryCharges,
        total,
      }

      await apiClient.createOrder(orderData)
      
      setShowSuccess(true)
      clearCart()

      // Redirect to home after 5 seconds
      setTimeout(() => {
        router.push('/')
      }, 5000)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white"></div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg px-4">
        <div className="text-center max-w-lg mx-auto">
          {/* Success Icon */}
          <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <FiCheck className="w-16 h-16 text-white" strokeWidth={3} />
          </div>

          {/* Main Message */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Order Placed Successfully!
          </h2>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your order
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-dark-surface rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800 mb-8 text-left">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">
              What happens next?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Order Confirmation</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">You'll receive a confirmation message shortly</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Processing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">We'll start preparing your order</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Updates via WhatsApp</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">We'll keep you updated about your order status</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiPackage className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Delivery in 7 Days</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your order will arrive at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">
              📱 Stay Connected
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              We will keep updating you about your order via WhatsApp on the number you provided.
            </p>
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
            Redirecting to home in a few seconds...
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Checkout
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Complete your order details
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 dark:bg-dark-surface rounded-2xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={details.customer_name}
                    onChange={(e) => handleInputChange('customer_name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={details.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                    placeholder="+92 300 1234567"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    We'll send order updates on WhatsApp
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={details.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                    placeholder="House/Flat no., Street, Area"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={details.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                      placeholder="Karachi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={details.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                      placeholder="Sindh"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={details.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                    placeholder="54000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={details.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                    placeholder="e.g., Near Main Market"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-6 rounded-xl font-black text-lg hover:bg-black dark:hover:bg-gray-100 hover:scale-105 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-dark-surface rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-800 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <img
                        src={item.image || '/placeholder.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.type === 'custom' && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <FiScissors className="w-3 h-3" />
                          +Rs {(3500 * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-bold">Rs {subtotal.toLocaleString()}</span>
                </div>

                {totalStitchingCost > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-2">
                      <FiScissors className="w-4 h-4" />
                      Stitching:
                    </span>
                    <span className="font-bold">Rs {totalStitchingCost.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    Delivery:
                  </span>
                  <span className="font-bold">Rs {deliveryCharges.toLocaleString()}</span>
                </div>

                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900 dark:text-white">Total:</span>
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">
                  ✓ Estimated delivery: 7 working days
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  We'll send updates via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}