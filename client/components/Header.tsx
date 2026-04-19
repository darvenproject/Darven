'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import logoLight from '@/assets/logo_bg_light.png';

export default function ModernHeader() {
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

  const buttonHoverEffect = "hover:scale-110 hover:-translate-y-0.5 active:scale-95 p-2 rounded-full transition-all duration-300 ease-out hover:bg-black/5";

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ready-made', label: 'Ready-Made' },
    { href: '/fabric', label: 'Fabric' },
    { href: '/stitch-your-own', label: 'Stitch Your Own Suit' },
  ];

  const isActiveLink = (href: string) => pathname === href;

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white border-gray-200"
        style={{
          paddingTop: isScrolled ? '0.5rem' : '0.75rem',
          paddingBottom: isScrolled ? '0.5rem' : '0.75rem',
        }}
      >
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Left - Menu Button (visible on all screens) */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center justify-center ${buttonHoverEffect} text-black`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link 
                href="/" 
                className="transition-all duration-300 hover:opacity-80 block"
              >
                <Image 
                  src={logoLight}
                  alt="SHOPDARVEN"
                  height={60} 
                  width={180}
                  priority
                  className="h-14 w-auto transition-all duration-300" 
                />
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end space-x-2">
              <Link
                href="/cart"
                className={`relative flex items-center justify-center ${buttonHoverEffect} text-black`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold transform translate-x-1 -translate-y-1 bg-black text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 bg-black/50 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 w-80 max-w-[85vw] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-all duration-300 hover:opacity-70 py-2 text-black ${
                  isActiveLink(link.href) ? 'border-b-2 border-black' : ''
                }`}
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