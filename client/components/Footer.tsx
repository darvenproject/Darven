'use client'

import Link from 'next/link'
import { Mail, MapPin, Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-light tracking-wider text-gray-900 dark:text-white mb-3">
              SHOPDARVEN
            </h3>
            <p className="text-sm font-light text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
              Premium quality kurta pajama and shalwar kameez for the modern Pakistani gentleman. 
              We offer ready-made suits, custom stitching, and premium fabrics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-light tracking-wide text-gray-900 dark:text-white mb-3 uppercase">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ready-made" className="text-sm font-light text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                  Ready Made
                </Link>
              </li>
              <li>
                <Link href="/stitch-your-own" className="text-sm font-light text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                  Stitch Your Own
                </Link>
              </li>
              <li>
                <Link href="/fabric" className="text-sm font-light text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                  Fabrics
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm font-light text-gray-600 dark:text-gray-400 hover:opacity-70 transition-opacity">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-sm font-light tracking-wide text-gray-900 dark:text-white mb-3 uppercase">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-sm font-light text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span>Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-light text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                <a href="mailto:shopdarven@gmail.com" className="hover:opacity-70 transition-opacity">
                  shopdarven@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-light text-gray-600 dark:text-gray-400 pt-2">
                <a 
                  href="https://www.instagram.com/shopdarven/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity flex items-center gap-3"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                  <span>ShopDarven</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-light text-gray-600 dark:text-gray-400">
                <a 
                  href="https://www.facebook.com/profile.php?id=61580410082761" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity flex items-center gap-3"
                >
                  <Facebook className="w-4 h-4" strokeWidth={1.5} />
                  <span>ShopDarven</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6">
          <p className="text-sm font-light text-gray-600 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} ShopDarven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}