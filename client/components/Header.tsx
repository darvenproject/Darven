'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Moon, Sun } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from './ThemeProvider';

export default function ModernHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTextColor = () => {
    if (isLandingPage && !isScrolled) {
      return theme === 'light' ? 'text-white' : 'text-black';
    }
    return theme === 'dark' ? 'text-white' : 'text-black';
  };

  const shouldShowShadow = isLandingPage && !isScrolled && theme === 'light';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !isLandingPage || isScrolled ? 'border-b' : ''
      }`}
      style={{
        background: isLandingPage && !isScrolled
          ? 'transparent'
          : theme === 'dark' 
            ? 'rgba(26, 26, 26, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: (!isLandingPage || isScrolled) ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: (!isLandingPage || isScrolled) ? 'blur(20px) saturate(180%)' : 'none',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className={`text-2xl font-light tracking-wider transition-all duration-300 hover:opacity-70 ${getTextColor()}`}
              style={shouldShowShadow ? { textShadow: '0 2px 4px rgba(0,0,0,0.3)' } : {}}
            >
              DARVEN
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {/* Cart Button */}
            <Link
              href="/cart"
              className={`relative transition-all duration-300 hover:opacity-70 ${getTextColor()}`}
              aria-label="Shopping cart"
            >
              <ShoppingCart 
                className="w-6 h-6" 
                strokeWidth={1.5}
                style={shouldShowShadow ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' } : {}}
              />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 text-xs rounded-full w-5 h-5 flex items-center justify-center font-light ${
                  theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`transition-all duration-300 hover:opacity-70 ${getTextColor()}`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon 
                  className="w-6 h-6" 
                  strokeWidth={1.5}
                  style={shouldShowShadow ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' } : {}}
                />
              ) : (
                <Sun 
                  className="w-6 h-6" 
                  strokeWidth={1.5}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}