'use client'

import { Ruler } from 'lucide-react'

export default function SizeChart() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ruler className="w-8 h-8 text-gray-700" />
            <h1 className="text-4xl font-light tracking-wide text-gray-900">
              SIZE CHART
            </h1>
          </div>
          <p className="text-gray-600 font-light">
            Find your perfect fit with our comprehensive size guide
          </p>
        </div>

        {/* Kurta Pajama Size Chart */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Kurta Pajama Sizes</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Chest (inches)</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Waist (inches)</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Length (inches)</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Shoulder (inches)</th>
                </tr>
              </thead>
              <tbody className="font-light">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">S</td>
                  <td className="text-center py-3 px-4">36-38</td>
                  <td className="text-center py-3 px-4">30-32</td>
                  <td className="text-center py-3 px-4">38-40</td>
                  <td className="text-center py-3 px-4">16-17</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">M</td>
                  <td className="text-center py-3 px-4">38-40</td>
                  <td className="text-center py-3 px-4">32-34</td>
                  <td className="text-center py-3 px-4">40-42</td>
                  <td className="text-center py-3 px-4">17-18</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">L</td>
                  <td className="text-center py-3 px-4">40-42</td>
                  <td className="text-center py-3 px-4">34-36</td>
                  <td className="text-center py-3 px-4">42-44</td>
                  <td className="text-center py-3 px-4">18-19</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">XL</td>
                  <td className="text-center py-3 px-4">42-44</td>
                  <td className="text-center py-3 px-4">36-38</td>
                  <td className="text-center py-3 px-4">44-46</td>
                  <td className="text-center py-3 px-4">19-20</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">XXL</td>
                  <td className="text-center py-3 px-4">44-46</td>
                  <td className="text-center py-3 px-4">38-40</td>
                  <td className="text-center py-3 px-4">46-48</td>
                  <td className="text-center py-3 px-4">20-21</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Measure */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">How to Measure</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Chest</h3>
              <p className="text-gray-700 font-light">
                Measure around the fullest part of your chest, keeping the tape measure horizontal.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Waist</h3>
              <p className="text-gray-700 font-light">
                Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Length</h3>
              <p className="text-gray-700 font-light">
                Measure from the highest point of your shoulder down to where you want the kurta to end.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Shoulder</h3>
              <p className="text-gray-700 font-light">
                Measure from one shoulder point to the other across the back.
              </p>
            </div>
          </div>
        </section>

        {/* Size Tips */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Size Tips</h2>
          
          <ul className="space-y-3 text-gray-700 font-light">
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span>All measurements are in inches and refer to body measurements, not garment dimensions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span>If you're between sizes, we recommend choosing the larger size for a more comfortable fit.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span>For custom stitching orders, please provide accurate measurements for the best fit.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span>Different fabrics may fit differently. Check product descriptions for specific fit notes.</span>
            </li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-900 text-white rounded-lg p-8 text-center mt-8">
          <h2 className="text-2xl font-light mb-3">Need Help with Sizing?</h2>
          <p className="text-gray-300 font-light mb-6">
            Our team is ready to assist you with personalized size recommendations
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
