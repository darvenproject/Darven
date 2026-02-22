'use client'

import { useState } from 'react'
import { FiMail, FiPhone, FiUser, FiMessageSquare, FiSend, FiCheckCircle } from 'react-icons/fi'
import { apiClient } from '@/lib/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await apiClient.submitContactForm(formData)
      setSubmitStatus({
        type: 'success',
        message: response.data.message || 'Thank you for contacting us! We will get back to you soon.'
      })
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to send message. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 mb-5 sm:mb-6 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Home
          </a>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-3 sm:mb-4">
            CONTACT US
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-8 md:p-12 shadow-sm">
          {submitStatus.type === 'success' && (
            <div className="mb-6 sm:mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
              <p className="text-sm sm:text-base text-green-800 font-medium">{submitStatus.message}</p>
            </div>
          )}

          {submitStatus.type === 'error' && (
            <div className="mb-6 sm:mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm sm:text-base text-red-800 font-medium">{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900 text-sm sm:text-base"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900 text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  minLength={10}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900 text-sm sm:text-base"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                Message *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                  <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={5}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900 resize-none text-sm sm:text-base"
                  placeholder="Tell us how we can help you..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-4 px-8 rounded-xl font-bold text-base sm:text-lg hover:bg-black hover:shadow-2xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">Other ways to reach us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase">Shop</h4>
                <ul className="space-y-2">
                  <li><a href="/ready-made" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Ready Made</a></li>
                  <li><a href="/stitch-your-own" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Stitch Your Own</a></li>
                  <li><a href="/fabric" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Fabrics</a></li>
                  <li><a href="/cart" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cart</a></li>
                  <li><a href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About Us</a></li>
                  <li><a href="/size-chart" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Size Chart</a></li>
                  <li><a href="/return-exchange-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Return & Exchange Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase">Contact</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <FiPhone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Karachi, Pakistan</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4 flex-shrink-0" />
                    <a href="mailto:shopdarven@gmail.com" className="hover:text-gray-900 transition-colors break-all">
                      shopdarven@gmail.com
                    </a>
                  </li>
                  <li className="text-sm text-gray-600 pt-1">
                    <a href="https://www.instagram.com/shopdarven/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                      Instagram: ShopDarven
                    </a>
                  </li>
                  <li className="text-sm text-gray-600">
                    <a href="https://www.facebook.com/profile.php?id=61580410082761" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                      Facebook: ShopDarven
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
