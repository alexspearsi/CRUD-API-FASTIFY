import Fastify, { type FastifyError, type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import { productRoutes } from './products/product.routes.js';

export class App {
  app: FastifyInstance;
  port: number;

  constructor() {
    this.app = Fastify()
    this.port = 8000;
  }

  private setupNotFoundHandler() {
    this.app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
      reply.code(404).send({
        message: `Route ${request.method} ${request.url} not found`
      })
    })
  }

  private setErrorHandler() {
    this.app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      reply.code(500).send({
        message: 'Internal Server Error'
      })
    })
  }

  public async init(): Promise<void> {
    this.setupNotFoundHandler()
    this.setErrorHandler()

    this.app.register(productRoutes, { prefix: '/api/products' })

    await this.app.listen({ port: this.port })

    console.log(`Server running at port:${this.port}`);
  }
}