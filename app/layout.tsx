import type { Metadata, Viewport } from 'next'
import { Manrope, Lora, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  subsets: ["latin", "latin-ext"],
  variable: "--font-script",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: 'Postawię Ci Namiot | Wynajem namiotów - Rybnik, Śląsk',
  description: 'Profesjonalny wynajem namiotów imprezowych, dmuchańców i atrakcji na komunie, urodziny, wesela i eventy firmowe. Rybnik i okolice - cały Śląsk.',
  keywords: 'wynajem namiotów, dmuchańce, imprezy, komunie, urodziny, wesela, eventy firmowe, Rybnik, Śląsk',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f4efe6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="pl" className={`${manrope.variable} ${lora.variable} ${dancingScript.variable} bg-background`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          {modal}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
