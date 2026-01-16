import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Car } from '@/types/car'

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

    return NextResponse.json(data)
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

    const { data, error } = await supabaseAdmin
      .from('cars')
      .update(car)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating car:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
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

