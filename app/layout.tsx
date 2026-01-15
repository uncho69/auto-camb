import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AUTOCAMB.IT - Auto Usate in Sardegna',
  description: 'Scopri il nostro parco auto dell\'usato in Sardegna. Auto usate garantite, km0 e servizi di cortesia.',
  icons: {
    icon: '/autocambmedia.png',
    apple: '/autocambmedia.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatBot />
      </body>
    </html>
  )
}

