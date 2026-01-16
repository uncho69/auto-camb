'use client'

import { useEffect, useState } from 'react'
import { getCar } from '@/lib/carsApi'
import CarDetail from '@/components/CarDetail'
import { Car } from '@/types/car'
import { notFound } from 'next/navigation'

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCar = async () => {
      try {
        const foundCar = await getCar(params.id)
        setCar(foundCar)
      } catch (error) {
        console.error('Error loading car:', error)
        setCar(null)
      } finally {
        setLoading(false)
      }
    }
    
    loadCar()
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
