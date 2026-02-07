import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ready Made Kurta Pajama Collection',
  description: 'Browse our premium ready-made kurta pajama and shalwar kameez collection. Available in Wash n Wear, Cotton, Blended, and Boski fabrics. Shop traditional Pakistani clothing.',
  keywords: ['ready made kurta pajama', 'shalwar kameez Pakistan', 'wash n wear kurta', 'cotton kurta', 'boski kurta', 'blended fabric'],
  openGraph: {
    title: 'Ready Made Kurta Pajama Collection | Darven',
    description: 'Browse our premium ready-made kurta pajama and shalwar kameez collection.',
    url: 'https://shopdarven.pk/ready-made',
  },
}

export default function ReadyMadeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
