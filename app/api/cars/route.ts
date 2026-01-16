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
  try {
    const car: Omit<Car, 'id'> = await request.json()

    const { data, error } = await supabaseAdmin
      .from('cars')
      .insert([car])
      .select()
      .single()

    if (error) {
      console.error('Error creating car:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

