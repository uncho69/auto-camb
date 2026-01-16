'use client'

import { useState, useEffect } from 'react'
import { getCars } from '@/lib/carsApi'
import CarCard from './CarCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Car } from '@/types/car'

export default function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carica le auto dal database
    const loadCars = async () => {
      try {
        const loadedCars = await getCars()
        setCars(loadedCars)
      } catch (error) {
        console.error('Error loading cars:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCars()
    
    // Ricarica ogni 30 secondi per avere dati aggiornati
    const interval = setInterval(loadCars, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Mostra auto "Disponibile" e "Prossimamente", escludi solo "Venduto"
  const featuredCars = cars.filter(car => car.status !== 'Venduto').slice(0, 6)

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Auto Usate</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scopri il nostro parco auto dell'usato in Sardegna
            </p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">Caricamento...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-900">Auto Usate</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scopri il nostro parco auto dell'usato in Sardegna
          </p>
        </div>

        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <p className="text-gray-600">Al momento non ci sono auto disponibili.</p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/auto"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Vedi tutte le auto
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

