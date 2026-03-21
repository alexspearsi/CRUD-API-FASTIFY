import type { FastifySchema } from "fastify";

export const productSchema: FastifySchema = {
	body: {
		type: "object",
		required: ["name", "description", "price", "category", "inStock"],
		properties: {
			name: { type: "string" },
			description: { type: "string" },
			price: { type: "number", exclusiveMinimum: 0 },
			category: { type: "string" },
			inStock: { type: "boolean" },
		},
		additionalProperties: false,
		example: {
			name: "iPhone 15",
			description: "Apple smartphone with A16 chip",
			price: 999,
			category: "electronics",
			inStock: true,
		},
	},
};

export const idSchema: FastifySchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: {
				type: "string",
				format: "uuid",
			},
		},
		example: {
			id: "9f1c6c7d-4c2b-4b7e-a1d8-6f5a2e3c9b01",
		},
	},
};

export const productResponseSchema = {
	type: "object",
	properties: {
		id: { type: "string", format: "uuid" },
		name: { type: "string" },
		description: { type: "string" },
		price: { type: "number" },
		category: { type: "string" },
		inStock: { type: "boolean" },
	},
	example: {
		name: "iPhone 15",
		description: "Apple smartphone with A16 chip",
		price: 999,
		category: "electronics",
		inStock: true,
	},
};

export const validationErrorSchema = {
	type: "object",
	properties: {
		message: { type: "string" },
		details: {
			type: "array",
			items: {
				type: "object",
				properties: {
					instancePath: { type: "string" },
					schemaPath: { type: "string" },
					keyword: { type: "string" },
					params: {
						type: "object",
						additionalProperties: true,
					},
					message: { type: "string" },
				},
			},
		},
	},
	example: {
		message: "body must have required property 'description'",
		details: [
			{
				instancePath: "",
				schemaPath: "#/required",
				keyword: "required",
				params: {
					missingProperty: "description",
				},
				message: "must have required property 'description'",
			},
		],
	},
};

export const notFoundSchema = {
	type: "object",
	properties: {
		message: { type: "string" },
	},
	example: {
		message: "Product with this ID doesn't exist",
	},
};
