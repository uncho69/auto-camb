import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { TradeRequest } from '@/types/tradeRequest'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST - Crea una nuova richiesta di permuta e invia email
export async function POST(request: NextRequest) {
  try {
    const tradeRequest: Omit<TradeRequest, 'id' | 'createdAt'> = await request.json()
    
    // Debug: log dei dati ricevuti
    console.log('Trade request received:', JSON.stringify(tradeRequest, null, 2))

    // Salva nel database
    const { data: savedRequest, error: dbError } = await supabaseAdmin
      .from('trade_requests')
      .insert([tradeRequest])
      .select()
      .single()

    if (dbError) {
      console.error('Error saving request:', dbError)
      console.error('Database error details:', JSON.stringify(dbError, null, 2))
      
      // Messaggio più specifico per errori comuni
      let errorMessage = dbError.message
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        errorMessage = 'Tabella trade_requests non trovata. Verifica che il database sia configurato correttamente.'
      } else if (dbError.message?.includes('column') && dbError.message?.includes('does not exist')) {
        errorMessage = 'Colonna mancante nella tabella. Verifica che tutte le colonne siano state create.'
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    // Invia email
    const adminEmail = process.env.ADMIN_EMAIL || 'autocambss@gmail.com'
    
    try {
      const emailResult = await resend.emails.send({
        from: 'AUTOCAMB.IT <onboarding@resend.dev>',
        to: adminEmail,
        subject: `Richiesta permuta auto - ${tradeRequest.marca || 'Generica'} ${tradeRequest.modello || ''}`,
        html: `
          <h2>Nuova richiesta: Permutiamo la tua auto</h2>
          <h3>Dati cliente:</h3>
          <ul>
            <li><strong>Nome:</strong> ${tradeRequest.nome}</li>
            <li><strong>Cognome:</strong> ${tradeRequest.cognome}</li>
            <li><strong>Email:</strong> ${tradeRequest.email}</li>
            <li><strong>Telefono:</strong> ${tradeRequest.telefono}</li>
            <li><strong>CAP:</strong> ${tradeRequest.cap}</li>
            ${tradeRequest.messaggio ? `<li><strong>Messaggio:</strong> ${tradeRequest.messaggio}</li>` : ''}
          </ul>
          <h3>Dettagli auto da permutare:</h3>
          <ul>
            ${tradeRequest.marca && tradeRequest.marca.trim() ? `<li><strong>Marca:</strong> ${tradeRequest.marca}</li>` : ''}
            ${tradeRequest.modello && tradeRequest.modello.trim() ? `<li><strong>Modello:</strong> ${tradeRequest.modello}</li>` : ''}
            ${tradeRequest.anno && tradeRequest.anno.trim() ? `<li><strong>Anno:</strong> ${tradeRequest.anno}</li>` : ''}
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
      .from('trade_requests')
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

