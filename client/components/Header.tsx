'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import logoLight from '@/assets/logo_transparent.png'

export default function Header() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const [scrollY, setScrollY] = useState(0)
  const [isPastFifthSection, setIsPastFifthSection] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const items = useCartStore((state) => state.items)
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    setScrollY(0)
    setIsPastFifthSection(false)
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null }

    if (!isHomePage) return

    const attach = () => {
      const container = document.getElementById('snap-container') as HTMLElement | null
      if (!container) {
        const t = setTimeout(attach, 100)
        cleanupRef.current = () => clearTimeout(t)
        return
      }
      const onScroll = () => {
        const y = container.scrollTop
        setScrollY(y)
        setIsPastFifthSection(y >= container.clientHeight * 4 - 80)
      }
      onScroll()
      container.addEventListener('scroll', onScroll, { passive: true })
      cleanupRef.current = () => container.removeEventListener('scroll', onScroll)
    }

    const t = setTimeout(attach, 50)
    return () => {
      clearTimeout(t)
      if (cleanupRef.current) cleanupRef.current()
    }
  }, [isHomePage, pathname])

  useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  const isTransparent = isHomePage && !isPastFifthSection

  // Navbar: fully transparent on home (no blur, no bg), white on other pages / footer slide
  const headerBg = isTransparent ? 'rgba(255,255,255,0)' : 'rgba(255,255,255,0.92)'
  const headerBorder = isTransparent ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.08)'
  const headerBlur = isTransparent ? 'none' : 'blur(20px)'

  // Menu panel: frosted glass on home page, solid white on other pages
  const menuBg = isHomePage
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(255,255,255,1)'
  const menuBlur = isHomePage ? 'blur(24px)' : 'none'
  const menuBorder = isHomePage ? '1px solid rgba(255,255,255,0.2)' : '1px solid #e5e7eb'
  const menuTextColor = isHomePage ? '#ffffff' : '#000000'
  const menuActiveColor = isHomePage ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.08)'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/ready-made', label: 'Ready-Made' },
    { href: '/fabric', label: 'Fabric' },
    { href: '/stitch-your-own', label: 'Stitch Your Own Suit' },
    { href: '/about', label: 'About' },
  ]

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
          backgroundColor: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
        }}
      >
        <div className="w-full px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">

            {/* Hamburger */}
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

            {/* Logo */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', background: 'transparent' }}>
              <Link href="/" className="block hover:opacity-80 transition-opacity duration-300">
                <Image
                  src={logoLight}
                  alt="DARVEN"
                  height={60}
                  width={180}
                  priority
                  style={{ height: '3.5rem', width: 'auto', mixBlendMode: 'multiply' }}
                />
              </Link>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              style={{ position: 'relative', color: '#000', padding: '0.5rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, transform: 'translate(4px,-4px)', fontSize: '10px', fontWeight: 700, borderRadius: '9999px', width: '1rem', height: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Backdrop — darker on home for contrast with glass menu */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          backgroundColor: isHomePage ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.5)',
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Slide-in menu — frosted glass on home, solid white elsewhere */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
          width: '20rem', maxWidth: '85vw',
          backgroundColor: menuBg,
          backdropFilter: menuBlur,
          WebkitBackdropFilter: menuBlur,
          borderRight: menuBorder,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease, background-color 0.4s ease',
        }}
      >
        <div className="flex flex-col h-full pt-24 px-6">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: menuTextColor,
                  textDecoration: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: pathname === link.href ? menuActiveColor : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
} 