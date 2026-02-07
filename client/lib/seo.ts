// SEO Utilities for structured data and metadata

export interface Product {
  id: number
  name: string
  description: string
  price: number
  material: string
  size?: string
  color?: string
  images: string[]
  stock: number
}

export interface Fabric {
  id: number
  name: string
  description: string
  price_per_meter: number
  material: string
  images: string[]
  stock_meters: number
}

// Generate JSON-LD structured data for products
export function generateProductSchema(product: Product, baseUrl: string = 'https://shopdarven.pk') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => 
      img.startsWith('http') ? img : `${baseUrl}${img}`
    ),
    brand: {
      '@type': 'Brand',
      name: 'Darven'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/ready-made/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'Darven'
      }
    },
    material: product.material,
    color: product.color,
    size: product.size,
    category: 'Apparel > Men > Traditional Clothing',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  }
}

// Generate JSON-LD structured data for fabrics
export function generateFabricSchema(fabric: Fabric, baseUrl: string = 'https://shopdarven.pk') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fabric.name,
    description: fabric.description,
    image: fabric.images.map(img => 
      img.startsWith('http') ? img : `${baseUrl}${img}`
    ),
    brand: {
      '@type': 'Brand',
      name: 'Darven'
    },
    offers: {
      '@type': 'Offer',
      price: fabric.price_per_meter,
      priceCurrency: 'PKR',
      availability: fabric.stock_meters > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/fabric/${fabric.id}`,
      seller: {
        '@type': 'Organization',
        name: 'Darven'
      }
    },
    material: fabric.material,
    category: 'Fabric',
  }
}

// Generate JSON-LD for Organization
export function generateOrganizationSchema(baseUrl: string = 'https://shopdarven.pk') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Darven',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Premium Pakistani traditional clothing store offering kurta pajama, shalwar kameez, and custom stitching services',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK'
    },
    sameAs: [
      // Add your social media links here when available
      // 'https://www.facebook.com/darven',
      // 'https://www.instagram.com/darven',
      // 'https://twitter.com/darven'
    ]
  }
}

// Generate JSON-LD for Website
export function generateWebsiteSchema(baseUrl: string = 'https://shopdarven.pk') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Darven',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// Generate JSON-LD for BreadcrumbList
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}
