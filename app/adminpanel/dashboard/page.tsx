'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car } from '@/types/car'
import { getCars, saveCars } from '@/lib/carsStorage'
import AdminCarList from '@/components/admin/AdminCarList'
import AdminCarForm from '@/components/admin/AdminCarForm'
import { Plus, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | null>(null)
  const [carsList, setCarsList] = useState<Car[]>([])

  useEffect(() => {
    // Verifica autenticazione
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true'
    if (!isAuth) {
      router.push('/adminpanel')
    } else {
      setAuthenticated(true)
      setLoading(false)
      // Carica le auto da localStorage
      setCarsList(getCars())
    }
  }, [router])

  useEffect(() => {
    // Verifica autenticazione
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true'
    if (!isAuth) {
      router.push('/adminpanel')
    } else {
      setAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_username')
    router.push('/adminpanel')
  }

  const handleAddCar = () => {
    setEditingCar(null)
    setShowForm(true)
  }

  const handleEditCar = (car: Car) => {
    setEditingCar(car)
    setShowForm(true)
  }

  const handleDeleteCar = (carId: string) => {
    if (confirm('Sei sicuro di voler eliminare questa auto?')) {
      const updatedCars = carsList.filter(car => car.id !== carId)
      setCarsList(updatedCars)
      saveCars(updatedCars)
      // Forza il refresh della pagina per aggiornare i componenti
      window.dispatchEvent(new Event('carsUpdated'))
    }
  }

  const handleSaveCar = (car: Car) => {
    let updatedCars: Car[]
    if (editingCar) {
      // Modifica auto esistente - mantieni la posizione
      updatedCars = carsList.map(c => c.id === car.id ? car : c)
    } else {
      // Aggiungi nuova auto IN CIMA alla lista
      updatedCars = [car, ...carsList]
    }
    setCarsList(updatedCars)
    saveCars(updatedCars)
    setShowForm(false)
    setEditingCar(null)
    // Forza il refresh della pagina per aggiornare i componenti
    window.dispatchEvent(new Event('carsUpdated'))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-900">Pannello Gestionale</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!showForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary-900">
                Auto nel parco ({carsList.length})
              </h2>
              <button
                onClick={handleAddCar}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                <Plus size={20} />
                Aggiungi Auto
              </button>
            </div>

            <AdminCarList
              cars={carsList}
              onEdit={handleEditCar}
              onDelete={handleDeleteCar}
            />
          </>
        ) : (
          <AdminCarForm
            car={editingCar}
            onSave={handleSaveCar}
            onCancel={() => {
              setShowForm(false)
              setEditingCar(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

