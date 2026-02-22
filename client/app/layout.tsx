import './globals.css'
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'

// Outfit is a very modern, geometric font that looks high-end
// Weights 700 (Bold) and 900 (Black) provide that thick, luxurious feel
const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://shopdarven.pk'),
  title: {
    default: 'ShopDarven - Premium Kurta Pajama & Shalwar Kameez | Traditional Pakistani Clothing',
    template: '%s | ShopDarven'
  },
  description: 'Shop premium quality kurta pajama, shalwar kameez, and traditional Pakistani clothing. Custom stitching services available. Ready-made and custom fabric options in Pakistan.',
  keywords: [
    'kurta pajama Pakistan',
    'shalwar kameez',
    'Pakistani clothing',
    'traditional wear Pakistan',
    'custom stitching Pakistan',
    'premium kurta',
    'men kurta pajama',
    'Pakistani men clothing',
    'wash n wear kurta',
    'cotton kurta pajama',
    'ready made shalwar kameez',
    'fabric shop Pakistan',
    'shopdarven',
    'online clothing Pakistan'
  ],
  authors: [{ name: 'ShopDarven' }],
  creator: 'ShopDarven',
  publisher: 'ShopDarven',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://shopdarven.pk',
    siteName: 'ShopDarven',
    title: 'ShopDarven - Premium Kurta Pajama & Shalwar Kameez',
    description: 'Shop premium quality kurta pajama, shalwar kameez, and traditional Pakistani clothing. Custom stitching services available.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopDarven - Premium Pakistani Clothing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopDarven - Premium Kurta Pajama & Shalwar Kameez',
    description: 'Shop premium quality kurta pajama, shalwar kameez, and traditional Pakistani clothing.',
    images: ['/og-image.jpg'],
    creator: '@shopdarven',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://shopdarven.pk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'ShopDarven',
    'url': 'https://shopdarven.pk',
    'logo': 'https://shopdarven.pk/logo.png',
    'description': 'Premium Pakistani traditional clothing store offering kurta pajama, shalwar kameez, and custom stitching services',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'PK'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ShopDarven',
    'url': 'https://shopdarven.pk',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://shopdarven.pk/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      {/* Applying outfit.className globally with antialiased rendering */}
      <body className={`${outfit.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}