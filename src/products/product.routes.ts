import type { FastifyInstance } from 'fastify';
import { ProductService } from './products.service.js';
import { ProductController } from './product.controller.js';

export async function productRoutes(app: FastifyInstance) {
  const service = new ProductService()
  const controller = new ProductController(service)

  app.get('/', controller.findAll.bind(controller))
  app.get('/:id', controller.findById.bind(controller))
  app.post('/', controller.create.bind(controller))
  app.put('/:id', controller.update.bind(controller))
  app.delete('/:id', controller.delete.bind(controller))
}