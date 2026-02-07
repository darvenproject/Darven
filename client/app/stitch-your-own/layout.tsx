import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Custom Stitching Service',
  description: 'Get your custom kurta pajama or shalwar kameez stitched with precise measurements. Professional tailoring service with premium fabrics. Order custom stitched clothing in Pakistan.',
  keywords: ['custom stitching Pakistan', 'custom kurta pajama', 'tailoring service', 'custom measurements', 'made to measure clothing'],
  openGraph: {
    title: 'Custom Stitching Service | Darven',
    description: 'Get your custom kurta pajama or shalwar kameez stitched with precise measurements.',
    url: 'https://shopdarven.pk/stitch-your-own',
  },
}

export default function StitchYourOwnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
