'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Car } from '@/types/car'
import { Fuel, Gauge, Calendar, Tag } from 'lucide-react'

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/auto/${car.id}`}>
        <div className="relative h-48 bg-gray-200">
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
          />
          {car.status === 'Venduto' && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Venduto
            </div>
          )}
          {car.status === 'Prossimamente' && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Prossimamente
            </div>
          )}
          {car.category === 'KM 0' && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              KM 0
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-primary-900">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-600">{car.version}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Gauge size={16} />
              <span>{formatKm(car.km)} Km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{new Date(car.year, 0).toLocaleDateString('it-IT', { month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Fuel size={16} />
              <span>{car.fuel}</span>
            </div>
          </div>

          {car.tags && car.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Prezzo</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(car.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">
                Consumo: {car.consumption} l/100km
              </p>
              <p className="text-xs text-gray-500">
                CO₂: {car.co2} g/km
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

