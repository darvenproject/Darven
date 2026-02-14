'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Moon, Sun, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useTheme } from './ThemeProvider';
import logoDark from '@/assets/logo_bg_dark.png';
import logoLight from '@/assets/logo_bg_light.png';

export default function ModernHeader() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : 'text-black';
  };

  const buttonHoverEffect = "hover:scale-110 hover:-translate-y-0.5 active:scale-95 p-2 rounded-full transition-all duration-300 ease-out hover:bg-black/5 dark:hover:bg-white/10";

  const navLinks = [
    { href: '/ready-made', label: 'Ready-Made' },
    { href: '/fabric', label: 'Fabric' },
    { href: '/stitch-your-own', label: 'Stitch Your Own Suit' },
  ];

  const isActiveLink = (href: string) => pathname === href;

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b"
        style={{
          background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          paddingTop: isScrolled ? '0.5rem' : '0.75rem',
          paddingBottom: isScrolled ? '0.5rem' : '0.75rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Mobile Menu Button (visible on mobile/tablet) */}
            <div className="flex-1 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center justify-center ${buttonHoverEffect} ${getTextColor()}`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Left - Desktop Navigation (hidden on mobile/tablet) */}
            <nav className="hidden lg:flex flex-1 items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 hover:opacity-70 ${getTextColor()} ${
                    isActiveLink(link.href) ? 'underline underline-offset-4' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center - Logo */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="transition-all duration-300 hover:opacity-80 block"
              >
                <Image 
                  src={theme === 'dark' ? logoDark : logoLight}
                  alt="SHOPDARVEN"
                  height={60} 
                  width={180}
                  priority
                  className="h-14 w-auto transition-all duration-300" 
                />
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex-1 flex items-center justify-end space-x-2">
              <Link
                href="/cart"
                className={`relative flex items-center justify-center ${buttonHoverEffect} ${getTextColor()}`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold transform translate-x-1 -translate-y-1 ${
                    theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center ${buttonHoverEffect} ${getTextColor()}`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Sun className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 max-w-[85vw] lg:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderRight: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex flex-col h-full pt-24 px-6">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-all duration-300 hover:opacity-70 py-2 ${getTextColor()} ${
                  isActiveLink(link.href) ? 'border-b-2' : ''
                }`}
                style={{
                  borderColor: isActiveLink(link.href) 
                    ? (theme === 'dark' ? '#ffffff' : '#000000')
                    : 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}