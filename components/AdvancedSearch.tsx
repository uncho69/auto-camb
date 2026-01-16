'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getCars } from '@/lib/carsApi'
import { useRouter } from 'next/navigation'
import { Car } from '@/types/car'

export default function AdvancedSearch() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<'Usato' | 'KM 0' | 'Tutti'>('Tutti')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedBodyType, setSelectedBodyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [activeTab, setActiveTab] = useState<'Prezzo' | 'Rata'>('Prezzo')
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    // Carica le auto dal database
    const loadCars = async () => {
      try {
        const loadedCars = await getCars()
        setCars(loadedCars)
      } catch (error) {
        console.error('Error loading cars:', error)
      }
    }
    
    loadCars()
    
    // Ricarica ogni 30 secondi per avere dati aggiornati
    const interval = setInterval(loadCars, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const brands = Array.from(new Set(cars.map(car => car.brand))).sort()
  const models = selectedBrand 
    ? Array.from(new Set(cars.filter(car => car.brand === selectedBrand).map(car => car.model))).sort()
    : []
  const bodyTypes = ['Berlina', 'SUV', 'Station Wagon', 'Coupé', 'Cabriolet', 'Monovolume']
  const priceRanges = [
    'Fino a € 10.000',
    '€ 10.000 - € 15.000',
    '€ 15.000 - € 20.000',
    '€ 20.000 - € 30.000',
    'Oltre € 30.000'
  ]

  const filteredCarsCount = cars.filter(car => {
    if (selectedCategory === 'Usato' && car.category !== 'Usato') return false
    if (selectedCategory === 'KM 0' && car.category !== 'KM 0') return false
    if (selectedBrand && car.brand !== selectedBrand) return false
    if (selectedModel && car.model !== selectedModel) return false
    if (priceRange) {
      const [min, max] = priceRange.includes('Fino') 
        ? [0, 10000]
        : priceRange.includes('Oltre')
        ? [30000, Infinity]
        : priceRange.match(/\d+/g)?.map(Number) || [0, Infinity]
      if (car.price < min || car.price > max) return false
    }
    return true
  }).length

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'Tutti') params.set('category', selectedCategory)
    if (selectedBrand) params.set('brand', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)
    if (selectedBodyType) params.set('bodyType', selectedBodyType)
    if (priceRange) params.set('price', priceRange)
    
    router.push(`/auto?${params.toString()}`)
  }

  return (
    <section className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Cerca nel nostro stock</h2>
          <p className="text-gray-300">Scopri tutte le nostre occasioni</p>
        </div>

        {/* Category checkboxes */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'Usato'}
              onChange={() => setSelectedCategory('Usato')}
              className="w-5 h-5 border-2 border-white bg-transparent checked:bg-white checked:border-white appearance-none rounded-full checked:ring-2 checked:ring-white checked:ring-offset-2 checked:ring-offset-gray-900"
            />
            <span>Usato</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'KM 0'}
              onChange={() => setSelectedCategory('KM 0')}
              className="w-5 h-5 border-2 border-white bg-transparent checked:bg-white checked:border-white appearance-none rounded-full checked:ring-2 checked:ring-white checked:ring-offset-2 checked:ring-offset-gray-900"
            />
            <span>KM 0</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'Tutti'}
              onChange={() => setSelectedCategory('Tutti')}
              className="w-5 h-5 border-2 border-white bg-transparent checked:bg-white checked:border-white appearance-none rounded-full checked:ring-2 checked:ring-white checked:ring-offset-2 checked:ring-offset-gray-900"
            />
            <span>Tutti</span>
          </label>
        </div>

        {/* Search filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Marca */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 h-6">Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value)
                setSelectedModel('')
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Scegli la marca</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Modello */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 h-6">Modello</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Scegli il modello</option>
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Carrozzeria */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-2 h-6">Carrozzeria</label>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
            >
              <option value="">Scegli la carrozzeria</option>
              {bodyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Prezzo/Rata */}
          <div className="flex flex-col">
            <div className="flex gap-2 mb-2 h-6 items-center">
              <button
                onClick={() => setActiveTab('Prezzo')}
                className={`px-4 py-1 text-sm font-medium transition ${
                  activeTab === 'Prezzo'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Prezzo
              </button>
              <button
                onClick={() => setActiveTab('Rata')}
                className={`px-4 py-1 text-sm font-medium transition ${
                  activeTab === 'Rata'
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Rata
              </button>
            </div>
            {activeTab === 'Prezzo' ? (
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Scegli il prezzo</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            ) : (
              <select
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Scegli la rata</option>
                <option value="100-200">€ 100 - € 200</option>
                <option value="200-300">€ 200 - € 300</option>
                <option value="300-400">€ 300 - € 400</option>
                <option value="400-500">€ 400 - € 500</option>
                <option value="500+">Oltre € 500</option>
              </select>
            )}
          </div>
        </div>

        {/* Search button */}
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition flex items-center gap-3"
          >
            <span>{filteredCarsCount} AUTO</span>
            <Search size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

