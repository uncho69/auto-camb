'use client'

import Image from 'next/image'
import { Car } from '@/types/car'
import { Fuel, Gauge, Calendar, Tag, Phone, Mail } from 'lucide-react'

interface CarDetailProps {
  car: Car
}

export default function CarDetail({ car }: CarDetailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatKm = (km: number) => {
    return new Intl.NumberFormat('it-IT').format(km)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <a href="/" className="hover:text-primary-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/auto" className="hover:text-primary-600">Auto Usate</a>
        <span className="mx-2">/</span>
        <span className="text-primary-900">{car.brand} {car.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative h-96 lg:h-[500px] bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
          />
          {car.status === 'Venduto' && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Venduto
            </div>
          )}
          {car.status === 'Prossimamente' && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Prossimamente
            </div>
          )}
          {car.category === 'KM 0' && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              KM 0
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary-900">
            {car.brand} {car.model}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{car.version}</p>

          {car.description && (
            <p className="text-gray-700 mb-6">{car.description}</p>
          )}

          {/* Key specs */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-900">Caratteristiche principali</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Gauge className="text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Chilometraggio</p>
                  <p className="font-semibold">{formatKm(car.km)} Km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Anno</p>
                  <p className="font-semibold">{car.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Fuel className="text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Carburante</p>
                  <p className="font-semibold">{car.fuel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="text-primary-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Categoria</p>
                  <p className="font-semibold">{car.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-primary-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Prezzo</p>
            <p className="text-4xl font-bold text-primary-600 mb-4">
              {formatPrice(car.price)}
            </p>
            {car.status === 'Disponibile' && (
              <div className="flex gap-3">
                <a
                  href="tel:0792638300"
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Chiama ora
                </a>
                <a
                  href="mailto:info@autocamb.it"
                  className="flex-1 bg-white border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center gap-2"
                >
                  <Mail size={20} />
                  Contatta
                </a>
              </div>
            )}
          </div>

          {/* Consumption */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary-900">Consumi ed emissioni</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Consumo (combinato):</span>
                <span className="font-semibold">{car.consumption} l/100km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emissioni di CO₂ (combinate):</span>
                <span className="font-semibold">{car.co2} g/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Classe di emissione:</span>
                <span className="font-semibold">{car.emissionClass}</span>
              </div>
            </div>
          </div>

          {car.tags && car.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-primary-900">Tag</h3>
              <div className="flex flex-wrap gap-2">
                {car.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

