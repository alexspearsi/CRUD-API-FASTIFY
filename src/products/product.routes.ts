import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { MemoryStorageService } from "../database/memory-storage.service.js";
import type { IStorageService } from "../database/storage.interface.js";
import { ProductController } from "./product.controller.js";
import { ProductService } from "./products.service.js";
import {
	idSchema,
	notFoundSchema,
	productResponseSchema,
	productSchema,
	validationErrorSchema,
} from "./schema/product.schema.js";

export async function productRoutes(
	app: FastifyInstance,
	options: FastifyPluginOptions & { storageService?: IStorageService },
) {
	const storage = options.storageService ?? new MemoryStorageService();

	const service = new ProductService(storage);
	const controller = new ProductController(service);

	app.get(
		"/",
		{
			schema: {
				tags: ["Products"],
				description: "Get all products",
				response: {
					200: {
						type: "array",
						items: productResponseSchema,
					},
				},
			},
		},
		controller.findAll.bind(controller),
	);

	app.get(
		"/:id",
		{
			schema: {
				...idSchema,
				tags: ["Products"],
				description: "Get product by id",
				response: {
					200: productResponseSchema,
					400: validationErrorSchema,
					404: notFoundSchema,
				},
			},
		},
		controller.findById.bind(controller),
	);

	app.post(
		"/",
		{
			schema: {
				...productSchema,
				tags: ["Products"],
				description: "Create product",
				response: {
					201: productResponseSchema,
					400: validationErrorSchema,
				},
			},
		},
		controller.create.bind(controller),
	);

	app.put(
		"/:id",
		{
			schema: {
				...idSchema,
				...productSchema,
				tags: ["Products"],
				description: "Update product",
				response: {
					200: productResponseSchema,
					400: validationErrorSchema,
					404: notFoundSchema,
				},
			},
		},
		controller.update.bind(controller),
	);
	app.delete(
		"/:id",
		{
			schema: {
				...idSchema,
				tags: ["Products"],
				description: "Delete product",
				response: {
					204: { type: "null" },
					400: validationErrorSchema,
					404: notFoundSchema,
				},
			},
		},
		controller.delete.bind(controller),
	);
}
