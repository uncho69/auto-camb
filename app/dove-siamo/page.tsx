'use client'

import { Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function DoveSiamoPage() {
  const sedi = [
    {
      nome: 'Sassari',
      indirizzo: 'Zona Industriale Predda Niedda Sud, Str. 14, 4 - 07100 Sassari',
      telefono: '079 2638300',
      email: 'autocambss@gmail.com',
    },
    {
      nome: 'Olbia',
      indirizzo: 'Zona Industriale Settore 7 - Via Filippine, 6 - 07026 Olbia (SS)',
      telefono: '3939790529',
      email: 'autocambss@gmail.com',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dove siamo</h1>
          <p className="text-xl text-primary-100">
            Vieni a trovarci nelle nostre sedi in Sardegna
          </p>
        </div>
      </div>

      {/* Sedi e orari Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-primary-900 mb-8 text-center">Sedi e orari</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sedi.map((sede, index) => (
              <div
                key={sede.nome}
                className="bg-white rounded-lg shadow-md p-8 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Nome Sede */}
                <h3 className="text-2xl font-bold text-primary-900 mb-6">{sede.nome}</h3>
                
                {/* Separatore */}
                <div className="border-b border-gray-200 mb-6"></div>
                
                {/* Indirizzo */}
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-primary-600 mt-1 flex-shrink-0" />
                    <p className="text-primary-800 text-sm leading-relaxed">{sede.indirizzo}</p>
                  </div>
                </div>
                
                {/* Separatore */}
                <div className="border-b border-gray-200 mb-6"></div>
                
                {/* Contatti */}
                <div className="space-y-4 mb-6">
                  {/* Telefono */}
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-primary-600 flex-shrink-0" />
                    <a
                      href={`tel:${sede.telefono.replace(/\s/g, '')}`}
                      className="text-primary-800 hover:text-primary-600 transition font-medium"
                    >
                      {sede.telefono}
                    </a>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-primary-600 flex-shrink-0" />
                    <a
                      href={`mailto:${sede.email}`}
                      className="text-primary-800 hover:text-primary-600 transition font-medium break-all"
                    >
                      {sede.email}
                    </a>
                  </div>
                </div>
                
                {/* Bottone CONTATTACI! */}
                <Link
                  href="/chi-siamo"
                  className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  CONTATTACI!
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mappa Section (opzionale per il futuro) */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Come raggiungerci</h2>
          <p className="text-primary-800 mb-8">
            Siamo facilmente raggiungibili dalle principali città della Sardegna. 
            Le nostre sedi sono situate in zone industriali ben servite e facilmente accessibili.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">Sassari</h3>
              <p className="text-sm text-primary-700">
                La nostra sede di Sassari si trova nella Zona Industriale Predda Niedda Sud, 
                facilmente raggiungibile dalla SS 131 e dalla SS 291.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">Olbia</h3>
              <p className="text-sm text-primary-700">
                La nostra sede di Olbia si trova nella Zona Industriale Settore 7, 
                a pochi minuti dall'aeroporto e dal porto.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

