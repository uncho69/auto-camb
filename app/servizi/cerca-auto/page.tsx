'use client'

import { useState } from 'react'
import { Send, Car } from 'lucide-react'

export default function CercaAutoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    cap: '',
    messaggio: '',
    marca: '',
    modello: '',
    km: '',
    privacy: false,
    marketing: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // Simula invio form (qui potresti integrare un'API reale)
    setTimeout(() => {
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
          marca: '',
          modello: '',
          km: '',
          privacy: false,
          marketing: false
        })
        setSubmitStatus('idle')
      }, 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cerca un'auto</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">
                Cerchi un'auto particolare? Noi la troviamo per te
              </h2>
              <p className="text-lg text-primary-800 mb-4">
                Se stai cercando uno specifico modello di automobile e non riesci a trovare quello più adatto a te, faccelo sapere. Anche se non è presente nel nostro stock lo cercheremo e troveremo per te!
              </p>
              <p className="text-primary-800">
                Grazie alla nostra esperienza nel settore, siamo in grado di trovare auto di tutti i segmenti, dalle citycar alle berline, dai SUV alle station wagon.
              </p>
              <p className="text-primary-800 mt-4">
                Per l'acquisto di <strong>auto usate e km0</strong> rivolgiti a AUTOCAMB.IT, siamo a <strong>Sassari</strong> ed <strong>Olbia</strong>. Compila il form e inviaci la tua richiesta inserendo la marca, il modello e il numero di km percorsi massimo, i nostri consulenti ti contatteranno quanto prima. Vieni a trovarci in Sardegna, ti aspettiamo!
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">Cerca la tua auto</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <p className="font-semibold">Richiesta inviata con successo!</p>
                  <p className="text-sm mt-1">Ti contatteremo al più presto.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dati Personali */}
                <div>
                  <h4 className="text-lg font-semibold text-primary-900 mb-4">Dati Personali</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-primary-900 mb-2">
                        Nome <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="cognome" className="block text-sm font-medium text-primary-900 mb-2">
                        Cognome <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cognome"
                        name="cognome"
                        required
                        value={formData.cognome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-primary-900 mb-2">
                        Telefono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Useremo questo numero per darti supporto"
                      />
                    </div>
                    <div>
                      <label htmlFor="cap" className="block text-sm font-medium text-primary-900 mb-2">
                        CAP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cap"
                        name="cap"
                        required
                        value={formData.cap}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="messaggio" className="block text-sm font-medium text-primary-900 mb-2">
                        Messaggio
                      </label>
                      <textarea
                        id="messaggio"
                        name="messaggio"
                        rows={4}
                        value={formData.messaggio}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Dettagli Auto */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
                    <Car className="text-primary-600" size={24} />
                    Dettagli della tua auto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="marca" className="block text-sm font-medium text-primary-900 mb-2">
                        Marca
                      </label>
                      <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Es. Fiat, Volkswagen..."
                      />
                    </div>
                    <div>
                      <label htmlFor="modello" className="block text-sm font-medium text-primary-900 mb-2">
                        Modello
                      </label>
                      <input
                        type="text"
                        id="modello"
                        name="modello"
                        value={formData.modello}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Es. Panda, Golf..."
                      />
                    </div>
                    <div>
                      <label htmlFor="km" className="block text-sm font-medium text-primary-900 mb-2">
                        km
                      </label>
                      <input
                        type="text"
                        id="km"
                        name="km"
                        value={formData.km}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="km massimi"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Checkboxes */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      name="privacy"
                      required
                      checked={formData.privacy}
                      onChange={handleChange}
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
                    className="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Invio in corso...' : 'Invia'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

