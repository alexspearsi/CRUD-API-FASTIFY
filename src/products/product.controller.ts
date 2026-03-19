import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ProductService } from './products.service.js';
import type { CreateProductDto } from './dto/create-product.dto.js';
import type { UpdateProductDto } from './dto/update-product.dto.js';

export class ProductController {
  constructor(private productService: ProductService) {
    this.productService = productService
  }

  findAll(req: FastifyRequest, reply: FastifyReply) {
    const products = this.productService.findAll()

    return reply.code(200).send(products)
  }

  findById(req: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) {
    const product = this.productService.findById(req.params.id)

    if (!product) {
      return reply.code(404).send({ message: "Product with this ID doesn't exist" })
    }

    return reply.code(200).send(product)
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