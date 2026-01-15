export interface Car {
  id: string
  brand: string
  model: string
  version: string
  year: number
  km: number
  fuel: 'Benzina' | 'Diesel' | 'Elettrica' | 'Ibrida' | 'Benzina/GPL'
  price: number
  image: string
  consumption: number
  co2: number
  emissionClass: string
  category: 'Usato' | 'KM 0'
  status: 'Disponibile' | 'Venduto' | 'Prossimamente'
  tags?: string[]
  description?: string
}

