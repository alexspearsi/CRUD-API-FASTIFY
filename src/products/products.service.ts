import { randomUUID } from 'crypto'
import type { CreateProductDto } from './dto/create-product.dto.js'
import type { UpdateProductDto } from './dto/update-product.dto.js'
import type { Product } from './interfaces/product.interface.js';

const products = [
  {
    id: '9f1c6c7d-4c2b-4b7e-a1d8-6f5a2e3c9b01',
    name: 'iPhone 14',
    description: 'Apple smartphone with A15 chip',
    price: 999,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3a7e5d9b-2f41-4c88-9c3e-1b7a6f2d8e44',
    name: 'AirPods Pro',
    description: 'Wireless noise-cancelling earbuds',
    price: 249,
    category: 'electronics',
    inStock: true
  },
  {
    id: 'd2b8f0a1-7c4e-4e9a-8b1c-5f3d7a6e2c90',
    name: 'iPad Air',
    description: 'Apple tablet with M1 chip',
    price: 599,
    category: 'electronics',
    inStock: false
  },
  {
    id: '7b4a2d1e-9c8f-4e2a-a7d3-5c6b8f1e0d22',
    name: 'MacBook Air M2',
    description: 'Lightweight Apple laptop with M2 chip',
    price: 1299,
    category: 'electronics',
    inStock: true
  }
];

export class ProductService {
  private products = products

  findAll() {
    return this.products
  }

  findById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id)
  }

  create(data: CreateProductDto): Product {
    const product: Product = {
      id: randomUUID(),
      ...data
    }

    this.products.push(product)

    return product;
  }

  update(id: string, data: UpdateProductDto): Product | null {
    const product = this.findById(id)

    if (!product) {
      return null
    }

    Object.assign(product, {
      id: product.id,
      ...data
    })

    return product;
  }

  delete(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id)

    if (index === -1) {
      return false
    }

    this.products.splice(index, 1)

    return true
  }
}