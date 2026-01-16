'use client'

import { useState } from 'react'
import { Send, Car } from 'lucide-react'

export default function CompraAutoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    cap: '',
    messaggio: '',
    marca: '',
    modello: '',
    anno: '',
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

    try {
      const response = await fetch('/api/buy-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          telefono: formData.telefono,
          cap: formData.cap,
          messaggio: formData.messaggio || undefined,
          marca: formData.marca || undefined,
          modello: formData.modello || undefined,
          anno: formData.anno || undefined,
          km: formData.km || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Errore nell\'invio della richiesta')
      }

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
          anno: '',
          km: '',
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
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Compriamo la tua auto</h1>
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
                Vendi la tua auto a Sassari ed Olbia
              </h2>
              <p className="text-lg text-primary-800 mb-4">
                La nostra concessionaria AUTOCAMB.IT <strong>acquista auto usate</strong> a Sassari ed Olbia corrispondendo il valore immediatamente <strong>in contanti</strong> oppure, se ti è più comodo, attraverso permuta.
              </p>
              
              <div className="bg-primary-50 border-l-4 border-primary-600 p-4 my-6">
                <h3 className="font-semibold text-primary-900 mb-2">Perché è meglio rivolgersi ad una concessionaria per vendere il tuo mezzo?</h3>
                <p className="text-primary-800 mb-4">
                  Le vendite tra privati ti potrebbero apparire più proficue, ma la realtà è ben diversa, infatti, non avrai le stesse sicurezze. Con noi non ti ritroverai di fronte a incertezze come assegni scoperti e perdite di tempo. Al loro posto avrai:
                </p>
                <ul className="list-disc list-inside space-y-2 text-primary-800">
                  <li><strong>Quotazione del tuo usato</strong> basata sul suo reale stato;</li>
                  <li>Versamento di denaro garantito e tempestivo;</li>
                  <li>Possibilità di usufruire della <strong>permuta</strong> per l'acquisto di una nuova vettura e di saldare solamente la differenza;</li>
                  <li>Espletamento di <strong>pratiche auto</strong>, come il passaggio di proprietà, di cui ci occuperemo.</li>
                </ul>
              </div>

              <div className="text-center my-6">
                <a
                  href="#form-valutazione"
                  className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Richiedi una valutazione
                </a>
              </div>

              <p className="text-primary-800 mb-4">
                Mettiti in contatto con il nostro personale per avere una valutazione iniziale. Completa il form sottostante con dati come <strong>brand</strong>, <strong>modello</strong>, <strong>anno di immatricolazione</strong>. Se sei soddisfatto della nostra valutazione, puoi raggiungerci in concessionaria per far controllare la tua auto di persona. I nostri tecnici potranno mantenere la stima iniziale o rivederla in base all'esito dell'ispezione. Vieni a trovarci a <strong>Sassari</strong> ed <strong>Olbia</strong>.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-6">
                <h3 className="font-semibold text-primary-900 mb-2">NON ACQUISTIAMO CON PAGAMENTO IN CONTANTI:</h3>
                <ul className="list-disc list-inside space-y-1 text-primary-800">
                  <li>Auto con più di 8 anni</li>
                  <li>Auto con più di 130.000km</li>
                  <li>Auto incidentate o fortemente danneggiate</li>
                  <li>Auto estere non attualmente targate italiane</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
                <p className="text-primary-800">
                  <strong>ATTENZIONE</strong>: La nostra quotazione sarà sempre inferiore rispetto a una compravendita tra privati. Come concessionaria sosteniamo la spesa di passaggio di proprietà a nostro carico della vettura e gli eventuali lavori di ripristino necessari per poter rivendere l'auto con garanzia di minimo 12 mesi. Pertanto ti consigliamo di fare richiesta SOLO nel caso in cui tu sappia che il valore proposto sarà simile o inferiore (a seconda delle condizioni dell'auto) alla quotazione di Quattroruote. Inoltre la valutazione verrà confermata al momento della visione e prova presso la nostra sede.
                </p>
              </div>
            </div>

            {/* Form */}
            <div id="form-valutazione" className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">Richiedi una valutazione</h3>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <p className="font-semibold">Richiesta inviata con successo!</p>
                  <p className="text-sm mt-1">Ti contatteremo al più presto per una valutazione.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <p className="font-semibold">Errore nell'invio della richiesta</p>
                  <p className="text-sm mt-1">Riprova più tardi o contattaci direttamente.</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <label htmlFor="anno" className="block text-sm font-medium text-primary-900 mb-2">
                        Anno
                      </label>
                      <input
                        type="text"
                        id="anno"
                        name="anno"
                        value={formData.anno}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Anno di immatricolazione"
                      />
                    </div>
                    <div>
                      <label htmlFor="km" className="block text-sm font-medium text-primary-900 mb-2">
                        Km
                      </label>
                      <input
                        type="text"
                        id="km"
                        name="km"
                        value={formData.km}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Chilometraggio"
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

