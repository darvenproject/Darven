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
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
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
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900 mb-4">
            CONTACT US
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm">
          {submitStatus.type === 'success' && (
            <div className="mb-8 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
              <FiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <p className="text-green-800 font-medium">{submitStatus.message}</p>
            </div>
          )}

          {submitStatus.type === 'error' && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900"
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
                  <FiMail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900"
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
                  <FiPhone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  minLength={10}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900"
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
                  <FiMessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  rows={6}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none transition-colors text-gray-900 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-black hover:shadow-2xl hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Other ways to reach us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <a href="mailto:shopdarven@gmail.com" className="hover:text-gray-900 transition-colors">
                      shopdarven@gmail.com
                    </a>
                  </li>
                  <li className="text-sm text-gray-600 pt-2">
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
