import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ProductService } from './products.service.js';
import type { CreateProductDto } from './dto/create-product.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';

export class ProductController {
  constructor(private productService: ProductService) {}

  findAll(req: FastifyRequest, reply: FastifyReply) {
    return this.productService.findAll()
  }

  findById(req: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) {
    return this.productService.findById(req.params.id)
  }

  create(req: FastifyRequest<{ Body: CreateProductDto}>, reply: FastifyReply) {
    return this.productService.create(req.body)
  }

  update(req: FastifyRequest<{ Params: { id: string }, Body: UpdateProductDto}>, reply: FastifyReply) {
    return this.productService.update(req.params.id, req.body)
  }

  delete(req: FastifyRequest<{ Params: {id: string }}>) {
    return this.productService.delete(req.params.id)
  }
}