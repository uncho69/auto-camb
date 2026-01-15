import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Partita IVA */}
        <div className="text-center mb-8 pb-8 border-b border-gray-800">
          <p className="text-gray-400">Partita IVA 01015250903</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/autocambmedia.png"
                alt="AUTOCAMB.IT"
                width={250}
                height={100}
                className="h-auto w-auto max-h-20 object-contain"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              Il tuo partner di fiducia per l'acquisto di auto usate in Sardegna.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Link rapidi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/auto" className="hover:text-white transition">Auto Usate</Link>
              </li>
              <li>
                <Link href="/km0" className="hover:text-white transition">Auto Km0</Link>
              </li>
              <li>
                <Link href="/servizi" className="hover:text-white transition">Servizi di cortesia</Link>
              </li>
              <li>
                <Link href="/chi-siamo" className="hover:text-white transition">Chi siamo</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/servizi/navetta" className="hover:text-white transition">Servizio Navetta</Link>
              </li>
              <li>
                <Link href="/servizi/domicilio" className="hover:text-white transition">Auto a domicilio</Link>
              </li>
              <li>
                <Link href="/servizi/permuta" className="hover:text-white transition">Permutiamo la tua auto</Link>
              </li>
              <li>
                <Link href="/servizi/compra" className="hover:text-white transition">Compriamo la tua auto</Link>
              </li>
            </ul>
          </div>

          {/* Contact Sassari */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Sassari</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm">Zona Industriale Predda Niedda Sud, Str. 14, 4 - 07100 Sassari</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:0792638300" className="hover:text-white transition">079 2638300</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:c.leda@zunino.com" className="hover:text-white transition text-sm">c.leda@zunino.com</a>
              </li>
            </ul>
          </div>

          {/* Contact Olbia */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Olbia</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-sm">Zona Industriale Settore 7 - Via Filippine, 6 - 07026 Olbia (SS)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:3939790529" className="hover:text-white transition">3939790529</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <a href="mailto:g.pagano@zunino.com" className="hover:text-white transition text-sm">g.pagano@zunino.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AUTOCAMB.IT. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}

