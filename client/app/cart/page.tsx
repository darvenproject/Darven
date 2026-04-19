'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiPackage, FiScissors } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const subtotal = getTotalPrice()
  
  // Calculate stitching cost (Rs 3,500 per custom suit)
  const customItems = items.filter(item => item.type === 'custom')
  const totalStitchingCost = customItems.reduce((total, item) => total + (3500 * item.quantity), 0)
  
  const deliveryCharges = 200
  const total = subtotal + totalStitchingCost + deliveryCharges

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <FiShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Add some items to get started!
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white py-3 px-8 rounded-xl font-bold hover:bg-black:bg-gray-100 hover:scale-105 transition-all text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-2xl p-4 sm:p-6 border-2 border-gray-200 hover:border-gray-300:border-gray-700 transition-all"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 border border-gray-300">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Item-specific details */}
                    <div className="mb-4">
                      {item.type === 'ready-made' && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <FiPackage className="w-4 h-4" />
                            <span>Material: {item.details?.material}</span>
                          </p>
                          <p>Size: {item.details?.size}</p>
                        </div>
                      )}

                      {item.type === 'fabric' && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <FiPackage className="w-4 h-4" />
                            <span>Material: {item.details?.material}</span>
                          </p>
                          <p>Length: {item.details?.length} meters</p>
                          <p>Rs {item.details?.price_per_meter?.toLocaleString()}/meter</p>
                        </div>
                      )}

                      {item.type === 'custom' && (
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-2 mb-2">
                            <FiScissors className="w-4 h-4" />
                            <span className="font-bold">Custom Stitched Suit</span>
                          </p>
                          <p>Fabric: {item.details?.fabric}</p>
                          <p>Material: {item.details?.material}</p>
                          <p>Color: {item.details?.color}</p>
                          <p>Fabric: {item.details?.meters || 4} meter{(item.details?.meters || 4) !== 1 ? 's' : ''}</p>
                          <details className="mt-3">
                            <summary className="cursor-pointer hover:text-gray-900:text-white font-bold text-xs uppercase">
                              View Full Details →
                            </summary>
                            <div className="mt-3 pl-4 space-y-2 text-xs border-l-2 border-gray-300">
                              <div>
                                <p className="font-bold text-gray-900 mb-1">Options:</p>
                                <p>Cuffs: {item.details?.measurements?.cuffs === 'yes' ? 'Yes' : 'No'}</p>
                                <p>Collar: {item.details?.measurements?.collarType === 'sherwani' ? 'Sherwani' : 'Shirt'}</p>
                                <p>Bottom: {item.details?.measurements?.bottomWear === 'pajama' ? 'Pajama' : 'Shalwar'}</p>
                              </div>

                              <div>
                                <p className="font-bold text-gray-900 mb-1">Kameez Measurements:</p>
                                <p>Collar: {item.details?.measurements?.customCollar}"</p>
                                <p>Shoulder: {item.details?.measurements?.customShoulder}"</p>
                                <p>Chest: {item.details?.measurements?.customChest}"</p>
                                <p>Sleeves: {item.details?.measurements?.customSleeves}"</p>
                                <p>Length: {item.details?.measurements?.customKameezLength}"</p>
                              </div>

                              {item.details?.measurements?.bottomWear === 'shalwar' && (
                                <div>
                                  <p className="font-bold text-gray-900 mb-1">Shalwar:</p>
                                  <p>Length: {item.details?.measurements?.customShalwarLength}"</p>
                                </div>
                              )}

                              {item.details?.measurements?.bottomWear === 'pajama' && (
                                <div>
                                  <p className="font-bold text-gray-900 mb-1">Pajama:</p>
                                  <p>Length: {item.details?.measurements?.customPajamaLength}"</p>
                                  <p>Waist: {item.details?.measurements?.customWaist}"</p>
                                  <p>Thigh: {item.details?.measurements?.customThigh}"</p>
                                </div>
                              )}
                            </div>
                          </details>
                          
                          {/* Stitching Cost Badge */}
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <FiScissors className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700">
                              Stitching: Rs 3,500
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 bg-white rounded-xl p-1 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900:bg-white hover:text-white:text-gray-900 transition-all"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>

                        <span className="text-gray-900 font-black min-w-[24px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-900:bg-white hover:text-white:text-gray-900 transition-all"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-black text-gray-900">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.type === 'custom' && (
                          <p className="text-xs text-gray-500">
                            + Rs {(3500 * item.quantity).toLocaleString()} stitching
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 lg:sticky lg:top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-bold">Rs {subtotal.toLocaleString()}</span>
                </div>

                {totalStitchingCost > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <FiScissors className="w-4 h-4" />
                      Stitching Cost:
                    </span>
                    <span className="font-bold">Rs {totalStitchingCost.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    Delivery:
                  </span>
                  <span className="font-bold">Rs {deliveryCharges.toLocaleString()}</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900">Total:</span>
                    <span className="text-3xl font-black text-gray-900">
                      Rs {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-black text-lg hover:bg-black:bg-gray-100 hover:scale-105 hover:shadow-2xl transition-all active:scale-95 mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block text-center text-gray-600 hover:text-gray-900:text-white font-bold transition-colors"
              >
                ← Continue Shopping
              </Link>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800 font-bold">
                  ✓ Free delivery on orders above Rs 10,000
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Estimated delivery: 7 working days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}