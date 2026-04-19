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

  const [scrollY, setScrollY] = useState(0);
  const [isPastFifthSection, setIsPastFifthSection] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsPastFifthSection(false);
    setScrollY(0);

    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      if (!isHomePage) return;

      const attempts = [
        'main > section',
        'main > div > section',
        'main > *',
        'section',
      ];

      for (const sel of attempts) {
        const found = Array.from(document.querySelectorAll(sel)).filter(
          (el) => (el as HTMLElement).offsetHeight > 100
        ) as HTMLElement[];

        if (found.length >= 5) {
          setIsPastFifthSection(y >= found[4].offsetTop - 80);
          return;
        }
      }
      setIsPastFifthSection(y >= window.innerHeight * 4);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, pathname]);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // On home page: transparent until 5th section
  // On other pages or past 5th section: frosted white
  const isTransparent = isHomePage && !isPastFifthSection;

  // Fade in white as user scrolls (0 at top, up to 0.9 after 150px)
  const whiteFill = isTransparent
    ? Math.min(scrollY / 150, 0.85)
    : 0.92;

  const bgColor = isTransparent && scrollY < 5
    ? 'rgba(255,255,255,0)'       // fully transparent at top
    : `rgba(255,255,255,${whiteFill})`;

  const borderColor = isTransparent && scrollY < 5
    ? 'rgba(0,0,0,0)'
    : `rgba(0,0,0,${Math.min(whiteFill * 0.1, 0.08)})`;

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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          paddingTop: !isTransparent && scrollY > 20 ? '0.5rem' : '0.75rem',
          paddingBottom: !isTransparent && scrollY > 20 ? '0.5rem' : '0.75rem',
        }}
      >
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                color: '#000',
                padding: '0.5rem',
                borderRadius: '9999px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isMobileMenuOpen
                ? <X className="w-6 h-6" strokeWidth={1.5} />
                : <Menu className="w-6 h-6" strokeWidth={1.5} />
              }
            </button>

            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <Link href="/" className="block hover:opacity-80 transition-opacity duration-300">
                <Image
                  src={logoLight}
                  alt="DARVEN"
                  height={60}
                  width={180}
                  priority
                  style={{ height: '3.5rem', width: 'auto' }}
                />
              </Link>
            </div>

            <Link
              href="/cart"
              aria-label="Shopping cart"
              style={{
                position: 'relative',
                color: '#000',
                padding: '0.5rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  transform: 'translate(4px, -4px)',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  width: '1rem',
                  height: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                  color: '#fff',
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Slide-in menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          width: '20rem',
          maxWidth: '85vw',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div className="flex flex-col h-full pt-24 px-6">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: '#000',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  borderBottom: pathname === link.href ? '2px solid #000' : 'none',
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