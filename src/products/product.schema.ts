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
	},
};

export const idSchema: FastifySchema = {
	params: {
		type: "object",
		required: ["id"],
		properties: {
			id: { type: "string", format: "uuid" },
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
		inStock: { type: "boolean" }
	}
}

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
};

export const notFoundSchema = {
	type: "object",
	properties: {
		message: { type: "string" }
	}
}