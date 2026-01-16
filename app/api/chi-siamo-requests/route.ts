import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'
import { ChiSiamoRequest } from '@/types/chiSiamoRequest'

// Funzione helper per inizializzare Resend
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set!')
    return null
  }
  return new Resend(apiKey)
}

// POST - Crea una nuova richiesta "Chi siamo" e invia email
export async function POST(request: NextRequest) {
  console.log('=== CHI SIAMO REQUEST API CALLED ===')
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)
  
  try {
    const chiSiamoRequest: Omit<ChiSiamoRequest, 'id' | 'createdAt'> = await request.json()
    console.log('Chi siamo request received:', JSON.stringify(chiSiamoRequest, null, 2))

    // Salva nel database
    const { data: savedRequest, error: dbError } = await supabaseAdmin
      .from('chi_siamo_requests')
      .insert([chiSiamoRequest])
      .select()
      .single()

    if (dbError) {
      console.error('Error saving request:', dbError)
      console.error('Database error details:', JSON.stringify(dbError, null, 2))
      
      // Messaggio più specifico per errori comuni
      let errorMessage = dbError.message
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        errorMessage = 'Tabella chi_siamo_requests non trovata. Verifica che il database sia configurato correttamente.'
      } else if (dbError.message?.includes('column') && dbError.message?.includes('does not exist')) {
        errorMessage = 'Colonna mancante nella tabella. Verifica che tutte le colonne siano state create.'
      }
      
      // Non blocchiamo se il salvataggio fallisce, proviamo comunque a inviare l'email
      console.warn('⚠️ Database save failed, but continuing with email...')
    } else {
      console.log('✅ Request saved to database:', savedRequest)
    }

    // Invia email
    const adminEmail = process.env.ADMIN_EMAIL || 'autocambss@gmail.com'
    const resendApiKey = process.env.RESEND_API_KEY
    
    console.log('=== EMAIL CONFIGURATION ===')
    console.log('Admin Email:', adminEmail)
    console.log('Has Resend Key:', !!resendApiKey)
    
    const resend = getResend()
    
    if (!resend) {
      console.error('❌ RESEND_API_KEY is missing! Cannot send email.')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }
    
    try {
      console.log('Attempting to send email...')
      const emailResult = await resend.emails.send({
        from: 'AUTOCAMB.IT <onboarding@resend.dev>',
        to: adminEmail,
        subject: `Richiesta informazioni - Chi siamo - ${chiSiamoRequest.nome} ${chiSiamoRequest.cognome}`,
        html: `
          <h2>Nuova richiesta: Chi siamo</h2>
          <h3>Dati cliente:</h3>
          <ul>
            <li><strong>Nome:</strong> ${chiSiamoRequest.nome}</li>
            <li><strong>Cognome:</strong> ${chiSiamoRequest.cognome}</li>
            <li><strong>Email:</strong> ${chiSiamoRequest.email}</li>
            <li><strong>Telefono:</strong> ${chiSiamoRequest.telefono}</li>
            <li><strong>CAP:</strong> ${chiSiamoRequest.cap}</li>
            ${chiSiamoRequest.messaggio && chiSiamoRequest.messaggio.trim() ? `<li><strong>Messaggio:</strong> ${chiSiamoRequest.messaggio}</li>` : ''}
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
      console.error('Full error object:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError), 2))
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Richiesta inviata con successo' }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

