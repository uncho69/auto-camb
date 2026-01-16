'use client'

import { useState } from 'react'
import { Send, Navigation } from 'lucide-react'
import Image from 'next/image'

export default function NavettaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    cap: '',
    messaggio: '',
    privacy: false,
    marketing: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.privacy) {
      alert('Devi accettare l\'informativa sulla privacy per procedere')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const requestData = {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        cap: formData.cap,
        messaggio: formData.messaggio || undefined,
      }
      
      console.log('Sending navetta request:', requestData)
      
      const response = await fetch('/api/navetta-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Errore nell\'invio della richiesta')
      }
      
      const result = await response.json()
      console.log('Request saved successfully:', result)

      setIsSubmitting(false)
      setSubmitStatus('success')
      
      // Reset form dopo 3 secondi
      setTimeout(() => {
        setFormData({
          nome: '',
          cognome: '',
          email: '',
          telefono: '',
          cap: '',
          messaggio: '',
          privacy: false,
          marketing: false
        })
        setSubmitStatus('idle')
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setIsSubmitting(false)
      setSubmitStatus('error')
      alert('Si è verificato un errore. Riprova più tardi.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Servizio Navetta</h1>
        </div>
      </div>

      {/* Image Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/shuttle-service.png"
              alt="Servizio Navetta"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-3xl font-bold text-primary-900 mb-6">
              Servizio navetta gratuito verso il centro città
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                AUTOCAMB.IT, concessionaria di auto usate e km0, offre a tutti i suoi clienti il servizio gratuito di <strong>navetta</strong> verso il centro città. Lascia la tua auto ai nostri esperti meccanici e torna subito in città.
              </p>
              <p>
                Grazie a noi non dovrai rinviare le tue attività e potrai svolgere le tue attività quotidiane senza problemi. Ti aspettiamo a <strong>Sassari</strong>, <strong>Alghero</strong> ed <strong>Olbia</strong>, vieni a trovarci!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center gap-3">
              <Navigation className="text-primary-600" size={28} />
              Richiedi informazioni
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-primary-900 mb-2">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Il tuo nome"
                  />
                </div>

                {/* Cognome */}
                <div>
                  <label htmlFor="cognome" className="block text-sm font-medium text-primary-900 mb-2">
                    Cognome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cognome"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Il tuo cognome"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="tua.email@esempio.com"
                  />
                </div>

                {/* Telefono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-primary-900 mb-2">
                    Telefono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="079 1234567"
                  />
                  <p className="text-xs text-gray-500 mt-1">Useremo questo numero per darti supporto</p>
                </div>

                {/* CAP */}
                <div className="md:col-span-2">
                  <label htmlFor="cap" className="block text-sm font-medium text-primary-900 mb-2">
                    CAP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cap"
                    name="cap"
                    value={formData.cap}
                    onChange={handleChange}
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="07100"
                  />
                </div>

                {/* Messaggio */}
                <div className="md:col-span-2">
                  <label htmlFor="messaggio" className="block text-sm font-medium text-primary-900 mb-2">
                    Messaggio
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    value={formData.messaggio}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Scrivi qui il tuo messaggio..."
                  />
                </div>
              </div>

              {/* Privacy Checkboxes */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={formData.privacy}
                    onChange={handleChange}
                    required
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="privacy" className="text-sm text-primary-900">
                    Accetto e acconsento l'informativa sulla privacy <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="marketing"
                    name="marketing"
                    checked={formData.marketing}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="marketing" className="text-sm text-primary-900">
                    Acconsento al trattamento dei miei dati personali per finalità di marketing (Opzionale)
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-3 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Invia
                    </>
                  )}
                </button>

                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <p className="font-medium">Richiesta inviata con successo!</p>
                    <p className="text-sm mt-1">Ti contatteremo presto.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <p className="font-medium">Errore nell'invio della richiesta.</p>
                    <p className="text-sm mt-1">Riprova più tardi o contattaci direttamente.</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

