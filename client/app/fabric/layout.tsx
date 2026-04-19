import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Fabrics Collection',
  description: 'Shop premium quality fabrics for custom stitching. Choose from Wash n Wear, Cotton, Lawn, Khaddar, Linen and more. Best fabric prices in Pakistan.',
  keywords: ['premium fabrics Pakistan', 'fabric shop', 'wash n wear fabric', 'cotton fabric', 'lawn fabric', 'custom stitching fabric'],
  openGraph: {
    title: 'Premium Fabrics Collection | Darven',
    description: 'Shop premium quality fabrics for custom stitching in Pakistan.',
    url: 'https://shopdarven.pk/fabric',
  },
}

export default function FabricLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
