import { Metadata } from 'next'
import { generateWaistCoatCollectionSchema } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Waist Coat | Premium Traditional Waistcoats | ShopDarven',
  description: 'Shop premium waist coats at ShopDarven. Elegant traditional Pakistani waistcoats in premium fabrics. Perfect pairing with kurta pajama and shalwar kameez.',
  keywords: [
    'waist coat Pakistan',
    'waistcoat kurta pajama',
    'traditional waist coat',
    'Pakistani waistcoat',
    'men waist coat',
    'formal waistcoat Pakistan',
    'ShopDarven waist coat',
  ],
  openGraph: {
    title: 'Waist Coat | Premium Traditional Waistcoats | ShopDarven',
    description: 'Shop premium waist coats at ShopDarven. Elegant traditional Pakistani waistcoats in premium fabrics.',
    url: 'https://shopdarven.pk/waist-coat',
    type: 'website',
  },
  alternates: {
    canonical: 'https://shopdarven.pk/waist-coat',
  },
}

export default function WaistCoatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const collectionSchema = generateWaistCoatCollectionSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  )
}
