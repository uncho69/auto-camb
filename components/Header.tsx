'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
          }}></div>
          
          <div className="relative container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex gap-6">
              <a 
                href="tel:0792638300" 
                className="flex items-center gap-2 hover:text-primary-400 transition-colors duration-200 group"
              >
                <Phone size={16} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">079 2638300</span>
              </a>
              <a 
                href="mailto:autocambss@gmail.com" 
                className="flex items-center gap-2 hover:text-primary-400 transition-colors duration-200 group"
              >
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">autocambss@gmail.com</span>
              </a>
            </div>
            <div className="hidden md:flex gap-6">
              <Link 
                href="/news" 
                className="hover:text-primary-400 transition-colors duration-200 font-medium relative group"
              >
                News
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                href="/confronta" 
                className="hover:text-primary-400 transition-colors duration-200 font-medium relative group"
              >
                Confronta i veicoli (0)
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-200"></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="py-4">
          {/* Logo centrato */}
          <div className="flex justify-center mb-3">
            <Link href="/" className="flex items-center h-48 md:h-64">
              <Image
                src="/autocambmedia.png"
                alt="AUTOCAMB.IT"
                width={3200}
                height={1280}
                className="h-full w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Menu orizzontale con separatori */}
          <div className="hidden md:flex items-center justify-center gap-1">
            <Link 
              href="/auto" 
              className="px-6 py-2 text-primary-800 hover:text-primary-600 font-medium relative group transition-colors"
            >
              Auto Usate
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href="/km0" 
              className="px-6 py-2 text-primary-800 hover:text-primary-600 font-medium relative group transition-colors"
            >
              Auto Km0
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-gray-300">|</span>
            <div className="relative group">
              <button className="px-6 py-2 text-primary-800 hover:text-primary-600 font-medium flex items-center gap-1 relative transition-colors">
                Servizi di cortesia
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link href="/servizi/navetta" className="block px-4 py-3 hover:bg-primary-50 transition border-b border-gray-100 first:rounded-t-lg">Servizio Navetta</Link>
                <Link href="/servizi/domicilio" className="block px-4 py-3 hover:bg-primary-50 transition border-b border-gray-100">Auto a domicilio</Link>
                <Link href="/servizi/permuta" className="block px-4 py-3 hover:bg-primary-50 transition border-b border-gray-100">Permutiamo la tua auto</Link>
                <Link href="/servizi/compra" className="block px-4 py-3 hover:bg-primary-50 transition border-b border-gray-100">Compriamo la tua auto</Link>
                <Link href="/servizi/cerca-auto" className="block px-4 py-3 hover:bg-primary-50 transition last:rounded-b-lg">Cerca un'auto</Link>
              </div>
            </div>
            <span className="text-gray-300">|</span>
            <Link 
              href="/chi-siamo" 
              className="px-6 py-2 text-primary-800 hover:text-primary-600 font-medium relative group transition-colors"
            >
              Chi siamo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href="/dove-siamo" 
              className="px-6 py-2 text-primary-800 hover:text-primary-600 font-medium relative group transition-colors"
            >
              Dove siamo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex justify-center">
            <button
              className="text-primary-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <Link href="/auto" className="block py-2 text-center text-primary-800 hover:text-primary-600">
                Auto Usate
              </Link>
              <Link href="/km0" className="block py-2 text-center text-primary-800 hover:text-primary-600">
                Auto Km0
              </Link>
              <Link href="/servizi" className="block py-2 text-center text-primary-800 hover:text-primary-600">
                Servizi di cortesia
              </Link>
              <Link href="/chi-siamo" className="block py-2 text-center text-primary-800 hover:text-primary-600">
                Chi siamo
              </Link>
              <Link href="/dove-siamo" className="block py-2 text-center text-primary-800 hover:text-primary-600">
                Dove siamo
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

