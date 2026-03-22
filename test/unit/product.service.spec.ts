import { validate } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryStorageService } from "../../src/database/memory-storage.service.js";
import type { Product } from "../../src/products/interfaces/product.interface.js";
import { ProductService } from "../../src/products/products.service.js";

const UPDATED_PRICE = 199;

const PRODUCT_DTO: Omit<Product, "id"> = {
	name: "New Product",
	description: "Something very cool!",
	price: 1099,
	category: "electronics",
	inStock: true,
};

const UPDATED_PRODUCT_DTO = {
	name: "New Product",
	description: "Something very cool!",
	price: 199,
	category: "electronics",
	inStock: false,
};

describe("Product Service", () => {
	let productService: ProductService;
	let storageService: MemoryStorageService;

	beforeEach(() => {
		storageService = new MemoryStorageService();
		productService = new ProductService(storageService);
	});

	it("should return empty array", async () => {
		const products = await productService.findAll();

		expect(products).toHaveLength(0);
	});

	it("should create a new product", async () => {
		const product = await productService.create(PRODUCT_DTO);
		const products = await productService.findAll();

		expect(product).toMatchObject(PRODUCT_DTO);
		expect(validate(product.id)).toBe(true);
		expect(products).toHaveLength(1);
	});

	it("should find product by id", async () => {
		const product = await productService.create(PRODUCT_DTO);

		const found = await productService.findById(product.id);

		expect(found).toEqual(product);
	});

	it("should update product", async () => {
		const product = await productService.create(PRODUCT_DTO);

		const updated = await productService.update(product.id, UPDATED_PRODUCT_DTO);

		expect(updated).not.toBeNull();

		if (updated) {
			expect(updated.id).toBe(product.id);
			expect(updated).toMatchObject(UPDATED_PRODUCT_DTO);
			expect(updated.price).toBe(UPDATED_PRICE);
			expect(updated.inStock).toBe(false);
		}
	});

	it("should delete product", async () => {
		const product = await productService.create(PRODUCT_DTO);

		await productService.delete(product.id);

		const products = await productService.findAll();
		expect(products).toHaveLength(0);
	});

	it("should return undefined for deleted product", async () => {
		const product = await productService.create(PRODUCT_DTO);

		await productService.delete(product.id);

		const result = await productService.findById(product.id);

		expect(result).toBeUndefined();
	});
});
