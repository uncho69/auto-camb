'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [username] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simula un piccolo delay per UX migliore
    await new Promise(resolve => setTimeout(resolve, 500))

    if (username === 'admin' && password === '2839!xX33333ac@') {
      // Salva la sessione
      sessionStorage.setItem('admin_authenticated', 'true')
      sessionStorage.setItem('admin_username', username)
      router.push('/adminpanel/dashboard')
    } else {
      setError('Credenziali non valide')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Lock className="text-primary-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Pannello Gestionale</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                readOnly
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Inserisci password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}

