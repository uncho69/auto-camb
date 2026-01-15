'use client'

import { Car } from '@/types/car'
import Image from 'next/image'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

interface AdminCarListProps {
  cars: Car[]
  onEdit: (car: Car) => void
  onDelete: (carId: string) => void
}

export default function AdminCarList({ cars, onEdit, onDelete }: AdminCarListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Immagine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dettagli
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prezzo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden">
                    <Image
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-semibold text-primary-900">
                      {car.brand} {car.model}
                    </div>
                    <div className="text-sm text-gray-500">{car.version}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div>{car.km.toLocaleString('it-IT')} km</div>
                    <div className="text-gray-500">{car.year} • {car.fuel}</div>
                    <div className="text-gray-500">{car.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-primary-600">
                    {formatPrice(car.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    car.status === 'Disponibile' 
                      ? 'bg-green-100 text-green-800'
                      : car.status === 'Venduto'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/auto/${car.id}`}
                      target="_blank"
                      className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded transition"
                      title="Visualizza"
                    >
                      <Eye size={18} />
                    </Link>
                    <button
                      onClick={() => onEdit(car)}
                      className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition"
                      title="Modifica"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(car.id)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition"
                      title="Elimina"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

