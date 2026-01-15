'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const carouselImages = [
  '/parcoauto.png',
  '/auto-camb-logo.png',
]

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (carouselImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000) // Cambia immagine ogni 5 secondi

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative text-white overflow-hidden">
      {/* Background - Image carousel */}
      <div className="absolute inset-0">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Parco auto ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-gray-900/85"></div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Auto Usate
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6 text-white drop-shadow-md">
            Scopri il nostro parco auto dell'usato in Sardegna
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow-sm">
            Naviga nel parco auto e trova la vettura perfetta per te. 
            Auto usate garantite, controllate e pronte per la strada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auto"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Esplora le auto
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/km0"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Auto Km0
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

