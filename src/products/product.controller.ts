import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateProductDto } from "./dto/create-product.dto.js";
import type { UpdateProductDto } from "./dto/update-product.dto.js";
import type { ProductService } from "./products.service.js";

export class ProductController {
	constructor(private productService: ProductService) {
		this.productService = productService;
	}

	findAll(_req: FastifyRequest, reply: FastifyReply) {
		const products = this.productService.findAll();

		return reply.code(200).send(products);
	}

	findById(
		req: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		const product = this.productService.findById(req.params.id);

		if (!product) {
			return reply
				.code(404)
				.send({ message: "Product with this ID doesn't exist" });
		}

		return reply.code(200).send(product);
	}

	create(req: FastifyRequest<{ Body: CreateProductDto }>, reply: FastifyReply) {
		const product = this.productService.create(req.body);

		return reply.code(201).send(product);
	}

	update(
		req: FastifyRequest<{ Params: { id: string }; Body: UpdateProductDto }>,
		reply: FastifyReply,
	) {
		const product = this.productService.update(req.params.id, req.body);

		if (!product) {
			return reply
				.code(404)
				.send({ message: "Product with this ID doesn't exist" });
		}

		return reply.code(200).send(product);
	}

	delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const isProductDeleted = this.productService.delete(req.params.id);

		if (!isProductDeleted) {
			return reply
				.code(404)
				.send({ message: "Product with this ID doesn't exist" });
		}

		return reply.code(204).send();
	}
}
