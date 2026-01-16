import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { BuyRequest } from '@/types/buyRequest'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST - Crea una nuova richiesta di vendita e invia email
export async function POST(request: NextRequest) {
  try {
    const buyRequest: Omit<BuyRequest, 'id' | 'createdAt'> = await request.json()

    // Salva nel database
    const { data: savedRequest, error: dbError } = await supabaseAdmin
      .from('buy_requests')
      .insert([buyRequest])
      .select()
      .single()

    if (dbError) {
      console.error('Error saving request:', dbError)
      console.error('Database error details:', JSON.stringify(dbError, null, 2))
      
      // Messaggio più specifico per errori comuni
      let errorMessage = dbError.message
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        errorMessage = 'Tabella buy_requests non trovata. Verifica che il database sia configurato correttamente.'
      } else if (dbError.message?.includes('column') && dbError.message?.includes('does not exist')) {
        errorMessage = 'Colonna mancante nella tabella. Verifica che la colonna "km" sia stata aggiunta.'
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    // Invia email
    const adminEmail = process.env.ADMIN_EMAIL || 'autocambss@gmail.com'
    
    try {
      const emailResult = await resend.emails.send({
        from: 'AUTOCAMB.IT <onboarding@resend.dev>',
        to: adminEmail,
        subject: `Richiesta vendita auto - ${buyRequest.marca || 'Generica'} ${buyRequest.modello || ''}`,
        html: `
          <h2>Nuova richiesta: Compriamo la tua auto</h2>
          <h3>Dati cliente:</h3>
          <ul>
            <li><strong>Nome:</strong> ${buyRequest.nome}</li>
            <li><strong>Cognome:</strong> ${buyRequest.cognome}</li>
            <li><strong>Email:</strong> ${buyRequest.email}</li>
            <li><strong>Telefono:</strong> ${buyRequest.telefono}</li>
            <li><strong>CAP:</strong> ${buyRequest.cap}</li>
            ${buyRequest.messaggio ? `<li><strong>Messaggio:</strong> ${buyRequest.messaggio}</li>` : ''}
          </ul>
          <h3>Dettagli auto da vendere:</h3>
          <ul>
            ${buyRequest.marca && buyRequest.marca.trim() ? `<li><strong>Marca:</strong> ${buyRequest.marca}</li>` : ''}
            ${buyRequest.modello && buyRequest.modello.trim() ? `<li><strong>Modello:</strong> ${buyRequest.modello}</li>` : ''}
            ${buyRequest.anno && buyRequest.anno.trim() ? `<li><strong>Anno:</strong> ${buyRequest.anno}</li>` : ''}
            ${buyRequest.km && buyRequest.km.trim() ? `<li><strong>Km:</strong> ${buyRequest.km}</li>` : ''}
          </ul>
          <p><strong>Data richiesta:</strong> ${new Date().toLocaleString('it-IT')}</p>
        `,
      })
      console.log('Email sent successfully:', emailResult)
    } catch (emailError: any) {
      console.error('Error sending email:', emailError)
      console.error('Email error details:', JSON.stringify(emailError, null, 2))
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
      .from('buy_requests')
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

