import type { FastifyReply, FastifyRequest } from "fastify";
import type { ProductDto } from "./dto/product.dto.js";
import type { ProductService } from "./products.service.js";

export class ProductController {
	constructor(private productService: ProductService) {
		this.productService = productService;
	}

	async findAll(_req: FastifyRequest, reply: FastifyReply) {
		const products = await this.productService.findAll();

		return reply.code(200).send(products);
	}

	async findById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const product = await this.productService.findById(req.params.id);

		if (!product) {
			return reply.code(404).send({ message: "Product with this ID doesn't exist" });
		}

		return reply.code(200).send(product);
	}

	async create(req: FastifyRequest<{ Body: ProductDto }>, reply: FastifyReply) {
		const product = await this.productService.create(req.body);

		return reply.code(201).send(product);
	}

	async update(
		req: FastifyRequest<{ Params: { id: string }; Body: ProductDto }>,
		reply: FastifyReply,
	) {
		const product = await this.productService.update(req.params.id, req.body);

		if (!product) {
			return reply.code(404).send({ message: "Product with this ID doesn't exist" });
		}

		return reply.code(200).send(product);
	}

	async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const isProductDeleted = await this.productService.delete(req.params.id);

		if (!isProductDeleted) {
			return reply.code(404).send({ message: "Product with this ID doesn't exist" });
		}

		return reply.code(204).send();
	}
}
