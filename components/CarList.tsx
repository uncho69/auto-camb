'use client'

import { useState, useMemo, useEffect } from 'react'
import { getCars } from '@/lib/carsApi'
import CarCard from './CarCard'
import { Car } from '@/types/car'
import { Search, Filter, X } from 'lucide-react'

interface CarListProps {
  initialFilters?: { [key: string]: string | string[] | undefined }
}

export default function CarList({ initialFilters }: CarListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedFuel, setSelectedFuel] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  // Carica le auto dal database
  useEffect(() => {
    const loadCars = async () => {
      try {
        const loadedCars = await getCars()
        setCars(loadedCars)
      } catch (error) {
        console.error('Error loading cars:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCars()
    
    // Ricarica ogni 30 secondi per avere dati aggiornati
    const interval = setInterval(loadCars, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Apply initial filters from URL params
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.brand) setSelectedBrand(String(initialFilters.brand))
      if (initialFilters.category) setSelectedCategory(String(initialFilters.category))
      if (initialFilters.model) setSearchTerm(String(initialFilters.model))
    }
  }, [initialFilters])

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)))
    return uniqueBrands.sort()
  }, [cars])

  const fuels = useMemo(() => {
    const uniqueFuels = Array.from(new Set(cars.map(car => car.fuel)))
    return uniqueFuels.sort()
  }, [cars])

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.version.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesBrand = !selectedBrand || car.brand === selectedBrand
      const matchesCategory = !selectedCategory || car.category === selectedCategory
      const matchesFuel = !selectedFuel || car.fuel === selectedFuel

      return matchesSearch && matchesBrand && matchesCategory && matchesFuel
    })
  }, [searchTerm, selectedBrand, selectedCategory, selectedFuel])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBrand('')
    setSelectedCategory('')
    setSelectedFuel('')
  }

  const activeFiltersCount = [selectedBrand, selectedCategory, selectedFuel].filter(Boolean).length

  return (
    <div>
      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cerca per marca, modello..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter size={20} />
            Filtri
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tutte le marche</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tutte</option>
                  <option value="Usato">Usato</option>
                  <option value="KM 0">KM 0</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carburante
                </label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Tutti</option>
                  {fuels.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <X size={16} />
                Rimuovi tutti i filtri
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Trovate <span className="font-semibold text-primary-600">{filteredCars.length}</span> auto
        </p>
      </div>

      {/* Cars grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">Nessuna auto trovata con i filtri selezionati.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Rimuovi filtri
          </button>
        </div>
      )}
    </div>
  )
}

