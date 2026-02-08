'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { apiClient } from '@/lib/api'

// Add these exports to prevent static generation issues
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

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle empty cart redirect on client side only
  useEffect(() => {
    if (mounted && items.length === 0 && !showSuccess) {
      router.push('/cart')
    }
  }, [mounted, items.length, showSuccess, router])

  const subtotal = getTotalPrice()
  const deliveryCharges = 200
  const total = subtotal + deliveryCharges

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
        delivery_charges: deliveryCharges,
        total,
      }

      await apiClient.createOrder(orderData)
      
      setShowSuccess(true)
      clearCart()

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  // Show success message
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Placed Successfully!
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            You will receive your order in 7 days.
          </p>

          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to home...
          </p>
        </div>
      </div>
    )
  }

  // Don't render form if cart is empty
  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={details.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={details.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Complete Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={details.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="House/Flat no., Street, Area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={details.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="Karachi"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={details.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                    placeholder="Sindh"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={details.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="54000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={details.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  placeholder="e.g., Near Main Market"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Delivery Charges:</span>
                <span>Rs {deliveryCharges.toLocaleString()}</span>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-700 pt-2">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>Rs {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                ✓ Estimated delivery in 7 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}