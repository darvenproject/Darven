import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Darven - Premium Pakistani Clothing'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 180, fontWeight: 'bold' }}>DARVEN</div>
        </div>
        <div style={{ fontSize: 48, opacity: 0.9 }}>
          Premium Kurta Pajama & Shalwar Kameez
        </div>
        <div style={{ fontSize: 32, opacity: 0.7, marginTop: 20 }}>
          Traditional Pakistani Clothing
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
