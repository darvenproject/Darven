'use client'

import { Ruler } from 'lucide-react'

export default function SizeChart() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Ruler className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
            <h1 className="text-3xl sm:text-4xl font-light tracking-wide text-gray-900">
              SIZE CHART
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-light px-2">
            Find your perfect fit with our comprehensive size guide
          </p>
        </div>

        {/* Kurta Pajama Size Chart */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 sm:mb-6">Kurta Pajama Sizes</h2>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">Size</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">Chest (in)</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">Waist (in)</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">Length (in)</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="font-light">
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 font-medium">S</td>
                    <td className="text-center py-3 px-2 sm:px-4">36-38</td>
                    <td className="text-center py-3 px-2 sm:px-4">30-32</td>
                    <td className="text-center py-3 px-2 sm:px-4">38-40</td>
                    <td className="text-center py-3 px-2 sm:px-4">16-17</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 font-medium">M</td>
                    <td className="text-center py-3 px-2 sm:px-4">38-40</td>
                    <td className="text-center py-3 px-2 sm:px-4">32-34</td>
                    <td className="text-center py-3 px-2 sm:px-4">40-42</td>
                    <td className="text-center py-3 px-2 sm:px-4">17-18</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 font-medium">L</td>
                    <td className="text-center py-3 px-2 sm:px-4">40-42</td>
                    <td className="text-center py-3 px-2 sm:px-4">34-36</td>
                    <td className="text-center py-3 px-2 sm:px-4">42-44</td>
                    <td className="text-center py-3 px-2 sm:px-4">18-19</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 font-medium">XL</td>
                    <td className="text-center py-3 px-2 sm:px-4">42-44</td>
                    <td className="text-center py-3 px-2 sm:px-4">36-38</td>
                    <td className="text-center py-3 px-2 sm:px-4">44-46</td>
                    <td className="text-center py-3 px-2 sm:px-4">19-20</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-2 sm:px-4 font-medium">XXL</td>
                    <td className="text-center py-3 px-2 sm:px-4">44-46</td>
                    <td className="text-center py-3 px-2 sm:px-4">38-40</td>
                    <td className="text-center py-3 px-2 sm:px-4">46-48</td>
                    <td className="text-center py-3 px-2 sm:px-4">20-21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How to Measure */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 sm:mb-6">How to Measure</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 bg-gray-50 rounded-lg sm:bg-transparent sm:p-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Chest</h3>
              <p className="text-sm sm:text-base text-gray-700 font-light">
                Measure around the fullest part of your chest, keeping the tape measure horizontal.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg sm:bg-transparent sm:p-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Waist</h3>
              <p className="text-sm sm:text-base text-gray-700 font-light">
                Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg sm:bg-transparent sm:p-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Length</h3>
              <p className="text-sm sm:text-base text-gray-700 font-light">
                Measure from the highest point of your shoulder down to where you want the kurta to end.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg sm:bg-transparent sm:p-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">Shoulder</h3>
              <p className="text-sm sm:text-base text-gray-700 font-light">
                Measure from one shoulder point to the other across the back.
              </p>
            </div>
          </div>
        </section>

        {/* Size Tips */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 sm:mb-6">Size Tips</h2>

          <ul className="space-y-3 text-gray-700 font-light">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">All measurements are in inches and refer to body measurements, not garment dimensions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">If you're between sizes, we recommend choosing the larger size for a more comfortable fit.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">For custom stitching orders, please provide accurate measurements for the best fit.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
              <span className="text-sm sm:text-base">Different fabrics may fit differently. Check product descriptions for specific fit notes.</span>
            </li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900 text-white rounded-lg p-6 sm:p-8 text-center mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-light mb-2 sm:mb-3">Need Help with Sizing?</h2>
          <p className="text-gray-300 font-light mb-5 sm:mb-6 text-sm sm:text-base">
            Our team is ready to assist you with personalized size recommendations
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-light text-sm sm:text-base active:scale-95"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}
