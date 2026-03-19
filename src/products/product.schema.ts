import type { FastifySchema } from 'fastify';

export const productSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['name', 'description', 'price', 'category', 'inStock'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string'},
      price: { type: 'number', exclusiveMinimum: 0 },
      category: { type: 'string' },
      inStock: { type: 'boolean' }
    },
    additionalProperties: false
  }
}

export const idSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' }
    },
    required: ['id']
  }
}