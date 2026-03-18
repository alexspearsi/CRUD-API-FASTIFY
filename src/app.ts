import Fastify, { type FastifyInstance } from 'fastify';
import { productRoutes } from './products/product.routes.js';

export class App {
  app: FastifyInstance;
  port: number;

  constructor() {
    this.app = Fastify()
    this.port = 8000;
  }

  public async init(): Promise<void> {
    this.app.register(productRoutes, { prefix: '/api/products' })

    await this.app.listen({ port: this.port })

    console.log(`Server running at port:${this.port}`);
  }
}