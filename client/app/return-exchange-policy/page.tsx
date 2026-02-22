'use client'

import { Package, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function ReturnExchangePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Home
          </a>
          <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-4">
            RETURNS / EXCHANGES POLICY
          </h1>
          <p className="text-gray-600 font-light">
            Please read our policy carefully before initiating a return or exchange
          </p>
        </div>

        {/* Return Shipping */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Package className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-3">Return Shipping</h2>
              <ul className="space-y-2 text-gray-700 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Return shipping is the customer's responsibility and cost.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Customers may arrange their own courier for sending items back.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>We recommend using a standard courier service with proof of postage.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Return & Exchange Eligibility */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <CheckCircle className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-light text-gray-900 mb-4">RETURN & EXCHANGE ELIGIBILITY</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Return Timeframe</h3>
                <p className="text-gray-700 font-light">
                  Items must be returned within <strong>47 days</strong> of receiving your order (including transit time back to our warehouse).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Condition Requirements</h3>
                <ul className="space-y-2 text-gray-700 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Item must be unworn, unwashed, and returned with original tags attached.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Items with odour, stains, or wear will be rejected.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Underwear, socks, and hygiene-sensitive items are non-returnable.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Category-Based Return Rules */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <AlertCircle className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-light text-gray-900 mb-4">CATEGORY-BASED RETURN RULES</h2>
              
              <div className="space-y-6">
                {/* Bags & Belts */}
                <div className="border-l-4 border-gray-300 pl-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Bags & Belts</h3>
                  <ul className="space-y-1 text-gray-700 font-light">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                      <span>No pickup & drop allowed. Customer must arrange courier for return/exchange.</span>
                    </li>
                  </ul>
                </div>

                {/* Sale / Clearance Items */}
                <div className="border-l-4 border-red-400 pl-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Sale / Clearance Items</h3>
                  <ul className="space-y-1 text-gray-700 font-light">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                      <span>No return, no exchange, no refund.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                      <span>No pickup & drop service for sale items.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Customers must arrange their own courier, but sale items cannot be returned/exchanged.</span>
                    </li>
                  </ul>
                </div>

                {/* Routine (Non-Sale) Items */}
                <div className="border-l-4 border-green-400 pl-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Routine (Non-Sale) Items</h3>
                  <ul className="space-y-1 text-gray-700 font-light">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                      <span>Pickup & drop service is allowed only for routine items.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                      <span>Maximum 2 articles per exchange request via pickup & drop.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>If more than 2 items, the customer must arrange their own courier.</span>
                    </li>
                  </ul>
                </div>

                {/* Orders Above Rs. 10,000 */}
                <div className="border-l-4 border-amber-400 pl-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Orders Above Rs. 10,000</h3>
                  <ul className="space-y-1 text-gray-700 font-light">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                      <span>Not eligible for refund (exchange only).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Refund Policy */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Clock className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-light text-gray-900 mb-4">REFUND POLICY</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Maximum Refund Limit</h3>
                <ul className="space-y-2 text-gray-700 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Refunds are only valid for orders maximum <strong>Rs. 10,000</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Shipping charges are non-refundable.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Refund Processing</h3>
                <ul className="space-y-2 text-gray-700 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Refund initiation: <strong>5-7 days</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Bank processing time: up to <strong>30 days</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange Rules */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Package className="w-6 h-6 text-gray-700 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-light text-gray-900 mb-4">EXCHANGE RULES</h2>
              
              <ul className="space-y-3 text-gray-700 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>Exchange is available only for the same product value or variant.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span><strong>PKR 250</strong> exchange fee applies on both normal and sale days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  <span>Sale items are not eligible for exchange.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                  <span>Exchange is available only for routine (non-sale) items.</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-2">For UAE Orders</h3>
                <p className="text-gray-700 font-light mb-2">
                  Once the item is collected and approved for exchange:
                </p>
                <ul className="space-y-2 text-gray-700 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>The customer will be charged the shipping cost again when sending out the replacement item.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>The replacement shipping fee is calculated as per international standard shipping rates.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-light mb-3">Questions About Returns or Exchanges?</h2>
          <p className="text-gray-300 font-light mb-6">
            Our customer service team is here to help
          </p>
          <a 
            href="/contact"
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-light"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}
