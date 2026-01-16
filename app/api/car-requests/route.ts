import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { CarRequest } from '@/types/carRequest'

// Inizializza Resend solo se la chiave esiste
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set!')
    return null
  }
  return new Resend(apiKey)
}

// POST - Crea una nuova richiesta e invia email
export async function POST(request: NextRequest) {
  console.log('=== CAR REQUEST API CALLED ===')
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)
  
  try {
    const carRequest: Omit<CarRequest, 'id' | 'createdAt'> = await request.json()
    console.log('Car request received:', JSON.stringify(carRequest, null, 2))

    // Salva nel database
    const { data: savedRequest, error: dbError } = await supabaseAdmin
      .from('car_requests')
      .insert([carRequest])
      .select()
      .single()

    if (dbError) {
      console.error('Error saving request:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // Invia email
    const adminEmail = process.env.ADMIN_EMAIL || 'autocambss@gmail.com'
    const resendApiKey = process.env.RESEND_API_KEY
    
    console.log('=== EMAIL CONFIGURATION ===')
    console.log('Admin Email:', adminEmail)
    console.log('Has Resend Key:', !!resendApiKey)
    console.log('Resend Key Length:', resendApiKey?.length || 0)
    console.log('Resend Key Preview:', resendApiKey ? `${resendApiKey.substring(0, 10)}...` : 'MISSING')
    
    const resend = getResend()
    
    if (!resend) {
      console.error('❌ RESEND_API_KEY is missing! Cannot send email.')
      console.error('Please check Vercel Environment Variables')
    } else {
      try {
        console.log('Attempting to send email...')
        const emailResult = await resend.emails.send({
          from: 'AUTOCAMB.IT <onboarding@resend.dev>', // Usa dominio Resend per test
          to: adminEmail,
          subject: `Nuova richiesta: Cerca un'auto - ${carRequest.marca || 'Generica'} ${carRequest.modello || ''}`,
          html: `
            <h2>Nuova richiesta: Cerca un'auto</h2>
            <h3>Dati cliente:</h3>
            <ul>
              <li><strong>Nome:</strong> ${carRequest.nome}</li>
              <li><strong>Cognome:</strong> ${carRequest.cognome}</li>
              <li><strong>Email:</strong> ${carRequest.email}</li>
              <li><strong>Telefono:</strong> ${carRequest.telefono}</li>
              <li><strong>CAP:</strong> ${carRequest.cap}</li>
              ${carRequest.messaggio ? `<li><strong>Messaggio:</strong> ${carRequest.messaggio}</li>` : ''}
            </ul>
            <h3>Dettagli auto richiesta:</h3>
            <ul>
              ${carRequest.marca && carRequest.marca.trim() ? `<li><strong>Marca:</strong> ${carRequest.marca}</li>` : ''}
              ${carRequest.modello && carRequest.modello.trim() ? `<li><strong>Modello:</strong> ${carRequest.modello}</li>` : ''}
              ${carRequest.km && carRequest.km.trim() ? `<li><strong>Km massimi:</strong> ${carRequest.km}</li>` : ''}
            </ul>
            <p><strong>Data richiesta:</strong> ${new Date().toLocaleString('it-IT')}</p>
          `,
        })
        console.log('✅ Email sent successfully!')
        console.log('Email Result:', JSON.stringify(emailResult, null, 2))
      } catch (emailError: any) {
        console.error('❌ Error sending email!')
        console.error('Error type:', emailError?.constructor?.name)
        console.error('Error message:', emailError?.message)
        console.error('Error stack:', emailError?.stack)
        console.error('Full error object:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError), 2))
        // Non blocchiamo la risposta se l'email fallisce, la richiesta è comunque salvata
      }
    }

    return NextResponse.json(savedRequest, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Ottieni tutte le richieste (per admin)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('car_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
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

