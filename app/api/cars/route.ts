import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Car } from '@/types/car'

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

    return NextResponse.json(data || [])
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
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

