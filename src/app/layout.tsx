import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import AuthProvider from '@/components/auth-provider'
import ChatbotWidget from '@/components/ui/chatbot-widget'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareerCraft AI - Your Personalized Career Navigator',
  description: 'AI-powered career guidance platform for Indian students. Get personalized career recommendations, skill gap analysis, and mentorship.',
  keywords: 'career guidance, AI career counseling, skill development, Indian students, career planning',
  authors: [{ name: 'CareerCraft AI Team' }],
  openGraph: {
    title: 'CareerCraft AI - Your Personalized Career Navigator',
    description: 'Transform your career journey with AI-powered guidance',
    url: 'https://careercraft.ai',
    siteName: 'CareerCraft AI',
    images: [
      {
        url: 'https://careercraft.ai/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerCraft AI',
    description: 'AI-powered career guidance for Indian students',
    images: ['https://careercraft.ai/twitter-image.png'],
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
            <ChatbotWidget />
            <Toaster
              position="bottom-left"
              toastOptions={{
                className: '',
                style: {
                  background: '#18181b',
                  color: '#fff',
                  border: '1px solid #27272a',
                },
              }}
            />
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}