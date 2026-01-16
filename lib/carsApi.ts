import { Car } from '@/types/car'

const API_URL = '/api/cars'

// GET - Ottieni tutte le auto
export async function getCars(): Promise<Car[]> {
  try {
    const response = await fetch(API_URL, {
      cache: 'no-store', // Sempre fetch fresh data
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch cars')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching cars:', error)
    return []
  }
}

// GET - Ottieni una singola auto
export async function getCar(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch car')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching car:', error)
    return null
  }
}

// POST - Aggiungi una nuova auto
export async function createCar(car: Omit<Car, 'id'>): Promise<Car> {
  console.log('Creating car:', car)
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  })
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Error response:', error)
    throw new Error(error.error || 'Failed to create car')
  }
  
  const result = await response.json()
  console.log('Car created successfully:', result)
  return result
}

// PUT - Aggiorna un'auto
export async function updateCar(id: string, car: Partial<Car>): Promise<Car> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(car),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update car')
  }
  
  return await response.json()
}

// DELETE - Elimina un'auto
export async function deleteCar(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete car')
  }
}

