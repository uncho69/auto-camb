import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-16 text-white overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=1920&h=1080&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/90 via-primary-800/85 to-primary-900/90"></div>
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
            Pronto a trovare la tua auto ideale?
          </h2>
          <p className="text-lg mb-8 text-white drop-shadow-sm">
            Contattaci per maggiori informazioni o per prenotare un appuntamento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0792638300"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Phone size={20} />
              Chiama ora
            </a>
            <a
              href="mailto:autocambss@gmail.com"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Mail size={20} />
              Invia email
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

