'use client'

import Link from 'next/link'
import Image from 'next/image'

const services = [
  {
    title: 'Cerca un\'auto',
    description: 'Cerchi un\'auto particolare? Noi la troviamo per te Se stai cercando uno specifico modello di automobile e non riesci a trovare quello più adatto a te, faccelo sapere. Anche se non è presente nel nostro parco auto, possiamo cercarla per te e proportela quando sarà disponibile.',
    image: '/cercaauto.png',
    link: '/servizi/cerca-auto',
  },
  {
    title: 'Compriamo la tua auto',
    description: 'Vendi la tua auto a Sassari, Alghero ed Olbia La nostra concessionaria AUTOCAMB.IT acquista auto usate a Sassari, Alghero ed Olbia corrispondendo il valore immediatamente in contanti oppure, se preferisci, possiamo valutare la tua auto per una permuta.',
    image: '/strettamano.png',
    link: '/servizi/compra',
  },
  {
    title: 'Permutiamo la tua auto',
    description: 'Permutiamo la tua auto usata in Sardegna Siamo tra i pochi concessionari a ritirare la tua auto usata in Sardegna a fronte dell\'acquisto di una nostra autovettura. Potrai quindi dare valore alla tua vecchia auto e acquistare quella nuova che desideri.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    link: '/servizi/permuta',
  },
]

export default function Services() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Servizi</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri i servizi dedicati ai nostri clienti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 bg-gray-200">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-primary-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-4">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition text-center w-full"
                >
                  SCOPRI DI PIÙ
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

