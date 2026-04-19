'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import logo from '../assets/logo_bg_light.png';

export default function ModernHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // 1. Logic for "Scrolled" state (triggers after 20px)
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 20);

      // 2. Logic for "Footer" detection
      // We check if the user has reached the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      setIsAtFooter(currentScroll + windowHeight >= documentHeight - 120);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Visual Logic: Should the navbar be white?
  // It turns white if: it's not the home page OR it's scrolled OR it's at the footer
  const shouldBeWhite = !isHomePage || isScrolled || isAtFooter;

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
    shouldBeWhite 
      ? "bg-white border-b border-gray-200 shadow-sm" 
      : "bg-transparent border-transparent"
  }`;

  const textColor = shouldBeWhite ? "text-black" : "text-white";
  
  // Hover effect adapts based on background transparency
  const buttonHoverEffect = `flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
    shouldBeWhite ? "hover:bg-black/5" : "hover:bg-white/20"
  }`;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ready-made', label: 'Ready-Made' },
    { href: '/fabric', label: 'Fabric' },
    { href: '/stitch-your-own', label: 'Stitch Your Own' },
  ];

  return (
    <>
      <header 
        className={headerClasses}
        style={{
          paddingTop: isScrolled ? '0.5rem' : '1rem',
          paddingBottom: isScrolled ? '0.5rem' : '1rem',
        }}
      >
        <div className="w-full px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Mobile Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`${buttonHoverEffect} ${textColor}`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="transition-all duration-300 hover:opacity-80 block">
                <Image 
                  src={logo} 
                  alt="SHOPDARVEN"
                  height={60} 
                  width={180}
                  priority
                  // Inverts the logo to white when on a transparent background
                  className={`h-12 md:h-14 w-auto transition-all duration-500 ${
                    !shouldBeWhite ? "brightness-0 invert" : ""
                  }`} 
                />
              </Link>
            </div>

            {/* Right: Cart */}
            <div className="flex items-center">
              <Link
                href="/cart"
                className={`relative ${buttonHoverEffect} ${textColor}`}
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

      {/* Background Overlay for Mobile Menu */}
      <div
        className={`fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[60] w-[300px] bg-white transform transition-transform duration-500 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8 pt-24">
          <nav className="flex flex-col space-y-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-light tracking-wide text-black transition-all hover:pl-3 ${
                  pathname === link.href ? "font-medium border-l-2 border-black pl-3" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-10 border-t border-gray-100">
             <p className="text-xs text-gray-400 uppercase tracking-widest">© Darven 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}