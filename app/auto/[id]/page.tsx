'use client'

import { useEffect, useState } from 'react'
import { getCars } from '@/lib/carsStorage'
import CarDetail from '@/components/CarDetail'
import { Car } from '@/types/car'
import { notFound } from 'next/navigation'

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cars = getCars()
    const foundCar = cars.find(c => c.id === params.id)
    setCar(foundCar || null)
    setLoading(false)
    
    // Ascolta gli aggiornamenti
    const handleUpdate = () => {
      const updatedCars = getCars()
      const updatedCar = updatedCars.find(c => c.id === params.id)
      setCar(updatedCar || null)
    }
    window.addEventListener('carsUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('carsUpdated', handleUpdate)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Caricamento...</div>
      </div>
    )
  }

  if (!car) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CarDetail car={car} />
    </div>
  )
}
