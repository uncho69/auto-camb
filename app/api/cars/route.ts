import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Car } from '@/types/car'

// Converte i dati dal database (snake_case) al tipo Car (camelCase)
function convertDbCarToCar(dbCar: any): Car {
  return {
    id: dbCar.id,
    brand: dbCar.brand,
    model: dbCar.model,
    version: dbCar.version,
    year: dbCar.year,
    km: dbCar.km,
    fuel: dbCar.fuel,
    price: Number(dbCar.price),
    image: dbCar.image,
    consumption: dbCar.consumption ? Number(dbCar.consumption) : 0,
    co2: dbCar.co2 ? Number(dbCar.co2) : 0,
    emissionClass: dbCar.emission_class || '',
    category: dbCar.category,
    status: dbCar.status,
    tags: dbCar.tags || [],
    description: dbCar.description || '',
  }
}

// GET - Ottieni tutte le auto
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cars:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Converti i dati dal formato database al formato Car
    const cars = (data || []).map(convertDbCarToCar)
    return NextResponse.json(cars)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Aggiungi una nuova auto
export async function POST(request: NextRequest) {
  console.log('=== CREATE CAR API CALLED ===')
  
  try {
    const car: Omit<Car, 'id'> = await request.json()
    console.log('Car data received:', JSON.stringify(car, null, 2))

    // Pulisci i dati e usa i nomi del database (snake_case)
    const cleanCar: any = {
      brand: car.brand,
      model: car.model,
      version: car.version,
      year: car.year,
      km: car.km,
      fuel: car.fuel,
      price: car.price,
      image: car.image,
      consumption: car.consumption || null,
      co2: (car.co2 && car.co2 > 0) ? car.co2 : null,
      emission_class: (car.emissionClass && car.emissionClass.trim()) ? car.emissionClass.trim() : null,
      category: car.category,
      status: car.status,
      tags: (car.tags && car.tags.length > 0) ? car.tags : null,
      description: (car.description && car.description.trim()) ? car.description.trim() : null,
    }

    console.log('Clean car data:', JSON.stringify(cleanCar, null, 2))

    const { data, error } = await supabaseAdmin
      .from('cars')
      .insert([cleanCar])
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating car:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: error.message || 'Errore nel salvataggio dell\'auto',
        details: error.details || null
      }, { status: 500 })
    }

    console.log('✅ Car created successfully:', data)
    // Converti i dati dal formato database al formato Car
    const convertedCar = convertDbCarToCar(data)
    return NextResponse.json(convertedCar, { status: 201 })
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

