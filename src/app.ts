import Fastify, { type FastifyInstance } from 'fastify';

export class App {
  app: FastifyInstance;
  port: number;

  constructor() {
    this.app = Fastify()
    this.port = 8000;
  }

  public async init(): Promise<void> {
    // this.app.register(routes, { prefix: '/api' })

    await this.app.listen({ port: this.port })

    console.log(`Server running at port:${this.port}`);
  }
}