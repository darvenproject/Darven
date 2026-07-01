import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shopdarven.pk'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ready-made`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/new-collection`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/waist-coat`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fabric`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/stitch-your-own`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ]

  // Fetch dynamic product pages
  let productPages: MetadataRoute.Sitemap = []
  let newCollectionPages: MetadataRoute.Sitemap = []
  let waistCoatPages: MetadataRoute.Sitemap = []
  let fabricPages: MetadataRoute.Sitemap = []

  try {
    // Fetch products from API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    const productsRes = await fetch(`${apiUrl}/ready-made`, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (productsRes.ok) {
      const products = await productsRes.json()
      productPages = products.map((product: any) => ({
        url: `${baseUrl}/ready-made/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }

    const newCollectionRes = await fetch(`${apiUrl}/new-collection`, {
      next: { revalidate: 3600 }
    })

    if (newCollectionRes.ok) {
      const newCollectionProducts = await newCollectionRes.json()
      newCollectionPages = newCollectionProducts.map((product: any) => ({
        url: `${baseUrl}/new-collection/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }

    const waistCoatRes = await fetch(`${apiUrl}/waist-coat`, {
      next: { revalidate: 3600 }
    })

    if (waistCoatRes.ok) {
      const waistCoatProducts = await waistCoatRes.json()
      waistCoatPages = waistCoatProducts.map((product: any) => ({
        url: `${baseUrl}/waist-coat/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }

    // Fetch fabrics from API
    const fabricsRes = await fetch(`${apiUrl}/fabrics`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (fabricsRes.ok) {
      const fabrics = await fabricsRes.json()
      fabricPages = fabrics.map((fabric: any) => ({
        url: `${baseUrl}/fabric/${fabric.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error)
  }

  return [...staticPages, ...productPages, ...newCollectionPages, ...waistCoatPages, ...fabricPages]
}
