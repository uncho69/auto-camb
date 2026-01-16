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

// GET - Ottieni una singola auto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('cars')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching car:', error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Converti i dati dal formato database al formato Car
    const car = convertDbCarToCar(data)
    return NextResponse.json(car)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna un'auto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const car: Partial<Car> = await request.json()
    
    // Converti camelCase in snake_case per il database
    const updateData: any = {}
    if (car.brand !== undefined) updateData.brand = car.brand
    if (car.model !== undefined) updateData.model = car.model
    if (car.version !== undefined) updateData.version = car.version
    if (car.year !== undefined) updateData.year = car.year
    if (car.km !== undefined) updateData.km = car.km
    if (car.fuel !== undefined) updateData.fuel = car.fuel
    if (car.price !== undefined) updateData.price = car.price
    if (car.image !== undefined) updateData.image = car.image
    if (car.consumption !== undefined) updateData.consumption = car.consumption
    if (car.co2 !== undefined) updateData.co2 = car.co2 || null
    if (car.emissionClass !== undefined) updateData.emission_class = car.emissionClass || null
    if (car.category !== undefined) updateData.category = car.category
    if (car.status !== undefined) updateData.status = car.status
    if (car.tags !== undefined) updateData.tags = car.tags || null
    if (car.description !== undefined) updateData.description = car.description || null

    const { data, error } = await supabaseAdmin
      .from('cars')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating car:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Converti i dati dal formato database al formato Car
    const convertedCar = convertDbCarToCar(data)
    return NextResponse.json(convertedCar)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina un'auto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('cars')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting car:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

