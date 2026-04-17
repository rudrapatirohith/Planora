import type { Metadata, Viewport } from 'next'
import { BRAND_NAME, BRAND_DESCRIPTION } from '@/lib/constants'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — Plan Your Perfect Trip`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: ['travel planner', 'trip management', 'itinerary', 'expense tracker', 'travel app'],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — Plan Your Perfect Trip`,
    description: BRAND_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — Plan Your Perfect Trip`,
    description: BRAND_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0B1120',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
