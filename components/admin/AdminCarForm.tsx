'use client'

import { useState, useEffect } from 'react'
import { Car } from '@/types/car'
import { X, Info } from 'lucide-react'

interface AdminCarFormProps {
  car?: Car | null
  onSave: (car: Car) => void
  onCancel: () => void
}

export default function AdminCarForm({ car, onSave, onCancel }: AdminCarFormProps) {
  const [formData, setFormData] = useState<Partial<Car>>({
    brand: '',
    model: '',
    version: '',
    year: new Date().getFullYear(),
    km: 0,
    fuel: 'Benzina',
    price: 0,
    image: '',
    consumption: 0,
    co2: 0,
    emissionClass: 'EURO6',
    category: 'Usato',
    status: 'Disponibile',
    tags: [],
    description: '',
  })

  useEffect(() => {
    if (car) {
      setFormData(car)
    }
  }, [car])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCar: Car = {
      id: car?.id || '', // L'ID verrà generato dal database se è una nuova auto
      brand: formData.brand || '',
      model: formData.model || '',
      version: formData.version || '',
      year: formData.year || new Date().getFullYear(),
      km: formData.km || 0,
      fuel: formData.fuel as Car['fuel'],
      price: formData.price || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      consumption: formData.consumption || 0,
      co2: formData.co2 || 0,
      emissionClass: formData.emissionClass || '',
      category: formData.category as Car['category'],
      status: formData.status as Car['status'],
      tags: formData.tags || [],
      description: formData.description || '',
    }

    onSave(newCar)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-900">
          {car ? 'Modifica Auto' : 'Aggiungi Nuova Auto'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Modello */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modello *
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Versione */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versione *
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Anno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anno *
            </label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="2000"
              max={new Date().getFullYear() + 1}
              required
            />
          </div>

          {/* Chilometraggio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chilometraggio *
            </label>
            <input
              type="number"
              value={formData.km}
              onChange={(e) => setFormData({ ...formData, km: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          {/* Carburante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carburante *
            </label>
            <select
              value={formData.fuel}
              onChange={(e) => setFormData({ ...formData, fuel: e.target.value as Car['fuel'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="Benzina">Benzina</option>
              <option value="Diesel">Diesel</option>
              <option value="Elettrica">Elettrica</option>
              <option value="Ibrida">Ibrida</option>
              <option value="Benzina/GPL">Benzina/GPL</option>
            </select>
          </div>

          {/* Prezzo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prezzo (€) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Car['category'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="Usato">Usato</option>
              <option value="KM 0">KM 0</option>
            </select>
          </div>

          {/* Stato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stato *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Car['status'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="Disponibile">Disponibile</option>
              <option value="Venduto">Venduto</option>
              <option value="Prossimamente">Prossimamente</option>
            </select>
          </div>

          {/* Consumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consumo (l/100km) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.consumption}
              onChange={(e) => setFormData({ ...formData, consumption: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          {/* CO2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emissioni CO₂ (g/km)
            </label>
            <input
              type="number"
              value={formData.co2 || ''}
              onChange={(e) => setFormData({ ...formData, co2: e.target.value ? parseInt(e.target.value) : 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
            />
          </div>

          {/* Classe emissione */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe Emissione
            </label>
            <input
              type="text"
              value={formData.emissionClass || ''}
              onChange={(e) => setFormData({ ...formData, emissionClass: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="EURO6"
            />
          </div>

          {/* URL Immagine */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center gap-2">
                URL Immagine *
                <div className="relative group">
                  <Info size={16} className="text-gray-400 hover:text-primary-600 cursor-help transition-colors" />
                  <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="font-semibold mb-2">Come ottenere il link diretto da ImgBB:</div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Vai su <span className="text-primary-300">imgbb.com</span> e carica la tua immagine</li>
                      <li>Cerca la sezione <span className="text-primary-300">"Direct links"</span> → <span className="text-primary-300">"Image link"</span></li>
                      <li>Copia quel link (dovrebbe essere tipo: <span className="text-primary-300">https://i.ibb.co/xxxxx/xxxxx.jpg</span>)</li>
                    </ol>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </span>
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://i.ibb.co/xxxxx/xxxxx.jpg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Inserisci l'URL dell'immagine dell'auto (per ora, in futuro sarà possibile caricare direttamente)
            </p>
          </div>

          {/* Descrizione */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Berlina due volumi, 5 porte..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            {car ? 'Salva Modifiche' : 'Aggiungi Auto'}
          </button>
        </div>
      </form>
    </div>
  )
}

