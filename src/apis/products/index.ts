import { Product } from '@/types/product'
import { mockProducts } from './mockProducts'

const API_DELAY_MS = 100

const createDelayPromise = (ms: number) => {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  await createDelayPromise(API_DELAY_MS)
  return mockProducts.slice(0, 6)
}

export const getAllProducts = async (): Promise<Product[]> => {
  await createDelayPromise(API_DELAY_MS)
  return mockProducts
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  color?: string
}

export const searchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  await createDelayPromise(API_DELAY_MS)
  
  let filteredProducts = [...mockProducts]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
    )
  }

  if (filters.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === filters.category)
  }

  if (filters.minPrice !== undefined) {
    const minPrice = filters.minPrice
    filteredProducts = filteredProducts.filter((product) => product.price >= minPrice)
  }

  if (filters.maxPrice !== undefined) {
    const maxPrice = filters.maxPrice
    filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice)
  }

  if (filters.color) {
    const color = filters.color
    filteredProducts = filteredProducts.filter((product) => product.color === color)
  }

  return filteredProducts
}

