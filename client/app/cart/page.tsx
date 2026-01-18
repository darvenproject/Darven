'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const subtotal = getTotalPrice()
  const deliveryCharges = 200
  const total = subtotal + deliveryCharges

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <FiShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
            Add some items to get started!
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-md"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>

                    {/* Item-specific details */}
                    {item.type === 'ready-made' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Material: {item.details?.material}</p>
                        <p>Size: {item.details?.size}</p>
                      </div>
                    )}

                    {item.type === 'fabric' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Material: {item.details?.material}</p>
                        <p>Length: {item.details?.length} meters</p>
                        <p>Price per meter: Rs {item.details?.price_per_meter?.toLocaleString()}</p>
                      </div>
                    )}

                    {item.type === 'custom' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Fabric: {item.details?.fabric}</p>
                        <p>Material: {item.details?.material}</p>
                        <details className="mt-2">
                          <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-white">
                            View Measurements
                          </summary>
                          <div className="mt-2 pl-4">
                            <p>Neck: {item.details?.measurements?.neck}"</p>
                            <p>Shoulder: {item.details?.measurements?.shoulder}"</p>
                            <p>Chest: {item.details?.measurements?.chest}"</p>
                            <p>Sleeve: {item.details?.measurements?.sleeve}"</p>
                            <p>Height: {item.details?.measurements?.height}"</p>
                            <p>Biceps: {item.details?.measurements?.biceps}"</p>
                            <p>Waist: {item.details?.measurements?.waist}"</p>
                            <p>Trouser Height: {item.details?.measurements?.trouser_height}"</p>
                          </div>
                        </details>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 dark:bg-dark-bg rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiMinus className="w-4 h-4 text-gray-900 dark:text-white" />
                        </button>

                        <span className="text-gray-900 dark:text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 dark:bg-dark-bg rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FiPlus className="w-4 h-4 text-gray-900 dark:text-white" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-surface rounded-lg p-4 sm:p-6 shadow-md lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                <span>Subtotal:</span>
                <span>Rs {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                <span>Delivery Charges:</span>
                <span>Rs {deliveryCharges.toLocaleString()}</span>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-700 pt-3 sm:pt-4">
                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span>Rs {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/"
              className="block text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-4 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
