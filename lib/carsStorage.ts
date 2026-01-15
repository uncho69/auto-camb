import { Car } from '@/types/car'
import { cars as defaultCars } from '@/data/cars'

const STORAGE_KEY = 'autocamb_cars'

export function getCars(): Car[] {
  if (typeof window === 'undefined') {
    // Server-side: usa i dati di default
    return defaultCars
  }

  // Client-side: controlla localStorage
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Errore nel parsing dei dati salvati:', e)
      return defaultCars
    }
  }

  // Se non c'è nulla in localStorage, inizializza con i dati di default
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCars))
  return defaultCars
}

export function saveCars(cars: Car[]): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars))
}

export function resetCars(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(STORAGE_KEY)
}

