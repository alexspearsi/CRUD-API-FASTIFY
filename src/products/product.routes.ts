import type { FastifyInstance, FastifySchema } from 'fastify';
import { ProductService } from './products.service.js';
import { ProductController } from './product.controller.js';
import { createProductSchema, idSchema } from './product.schema.js';

export async function productRoutes(app: FastifyInstance) {
  const service = new ProductService()
  const controller = new ProductController(service)

  app.get('/', controller.findAll.bind(controller))
  app.get('/:id', { schema: idSchema }, controller.findById.bind(controller))
  app.post('/', { schema: createProductSchema }, controller.create.bind(controller))
  app.put('/:id', { schema: idSchema }, controller.update.bind(controller))
  app.delete('/:id', { schema: idSchema }, controller.delete.bind(controller))
}