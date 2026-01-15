import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Pagina non trovata</h2>
      <p className="text-gray-600 mb-8">
        La pagina che stai cercando non esiste.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
      >
        Torna alla homepage
      </Link>
    </div>
  )
}

