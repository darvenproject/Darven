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
  const isHomePage = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastFifthSection, setIsPastFifthSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Reset on page change
    setIsPastFifthSection(false);
    setIsScrolled(false);

    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Try multiple selectors in priority order to find 5+ sections
      const selectors = [
        'main > section',
        'main > div > section',
        '[data-section]',
        'main > *',
      ];

      let sections: NodeListOf<Element> | null = null;
      for (const sel of selectors) {
        const found = document.querySelectorAll(sel);
        if (found.length >= 5) {
          sections = found;
          break;
        }
      }

      if (sections && sections.length >= 5) {
        const fifthSection = sections[4] as HTMLElement;
        const offsetTop = fifthSection.offsetTop;
        setIsPastFifthSection(scrollY + 80 >= offsetTop);
      } else {
        // Fallback: 4 viewport heights
        setIsPastFifthSection(scrollY >= window.innerHeight * 4);
      }
    };

    handleScroll(); // run on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Transparent only on homepage BEFORE 5th section
  const isTransparent = isHomePage && !isPastFifthSection;

  const iconColor = isTransparent ? 'text-white' : 'text-black';
  const hoverBg = isTransparent ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const buttonClass = `flex items-center justify-center p-2 rounded-full transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 active:scale-95 ${hoverBg} ${iconColor}`;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ready-made', label: 'Ready-Made' },
    { href: '/fabric', label: 'Fabric' },
    { href: '/stitch-your-own', label: 'Stitch Your Own Suit' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isTransparent
            ? 'bg-transparent border-transparent shadow-none'
            : 'bg-white border-b border-gray-200 shadow-sm'
        }`}
        style={{
          paddingTop: isScrolled && !isTransparent ? '0.5rem' : '0.75rem',
          paddingBottom: isScrolled && !isTransparent ? '0.5rem' : '0.75rem',
        }}
      >
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">

            {/* Hamburger */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={buttonClass}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen
                  ? <X className="w-6 h-6" strokeWidth={1.5} />
                  : <Menu className="w-6 h-6" strokeWidth={1.5} />
                }
              </button>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link href="/" className="block transition-opacity duration-300 hover:opacity-80">
                <Image
                  src={logoLight}
                  alt="DARVEN"
                  height={60}
                  width={180}
                  priority
                  className={`h-14 w-auto transition-all duration-500 ${
                    isTransparent ? 'brightness-0 invert' : ''
                  }`}
                />
              </Link>
            </div>

            {/* Cart */}
            <div className="flex items-center justify-end space-x-2">
              <Link href="/cart" className={`relative ${buttonClass}`} aria-label="Shopping cart">
                <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold translate-x-1 -translate-y-1 ${
                    isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
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
                  pathname === link.href ? 'border-b-2 border-black' : ''
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