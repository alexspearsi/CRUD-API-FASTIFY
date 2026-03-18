import type { FastifyInstance } from 'fastify';
import { ProductService } from './products.service.js';
import { ProductController } from './product.controller.js';

export async function productRoutes(app: FastifyInstance) {
  const service = new ProductService()
  const controller = new ProductController(service)

  app.get('/', controller.findAll)
  app.get('/:id', controller.findById)
  app.post('/', controller.create)
  app.put('/:id', controller.update)
  app.delete('/:id', controller.delete)
}