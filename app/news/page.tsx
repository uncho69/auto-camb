'use client'

import Link from 'next/link'
import { Home, Newspaper } from 'lucide-react'

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="mb-6">
              <Newspaper size={64} className="mx-auto text-primary-600 mb-4" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
              News
            </h1>
            <p className="text-xl text-primary-800 mb-8">
              Al momento non ci sono news.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Home size={20} />
              Torna alla homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

