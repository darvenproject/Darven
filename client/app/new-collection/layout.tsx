import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Collection | Darven',
  description: 'Explore our latest new collection. Fresh arrivals in premium fabrics including Wash n Wear, Cotton and Boski. Shop the newest Pakistani clothing.',
  keywords: ['new collection kurta', 'new arrival shalwar kameez', 'latest kurta pajama', 'new Pakistani clothing', 'fresh arrivals'],
  openGraph: {
    title: 'New Collection | Darven',
    description: 'Explore our latest new collection of premium kurta pajama and shalwar kameez.',
    url: 'https://shopdarven.pk/new-collection',
  },
}

export default function NewCollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}