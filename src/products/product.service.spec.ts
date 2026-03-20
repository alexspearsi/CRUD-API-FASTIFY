import { validate } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { products } from "../database/product.store.js";
import { ProductService } from "./products.service.js";

describe("Product Service", () => {
	let service: ProductService;

  const dto = {
    name: "New Product",
    description: "Something very cool!",
    price: 1099,
    category: "electronics",
    inStock: true,
  };

  const updatedDto = {
    name: "New Product",
    description: "Something very cool!",
    price: 199,
    category: "electronics",
    inStock: false,
  }

	beforeEach(() => {
    products.length = 0
		service = new ProductService();
	});

  it("should return empty array", () => {
    expect(products).toHaveLength(0)
  })

	it("should create a new product", () => {
		const product = service.create(dto);

		expect(product).toMatchObject(dto);
    expect(validate(product.id)).toBe(true);
		expect(products).toContainEqual(product);
	});

  it("should find product by id", () => {
    const product = service.create(dto);

    const found = service.findById(product.id);

    expect(found).toEqual(product)
  })

  it("should update product", () => {
    const product = service.create(dto);

    const updated = service.update(product.id, updatedDto)

    if (updated) {
      expect(updated.id).toBe(product.id)
      expect(updated).toMatchObject(updatedDto)
      expect(updated.price).toBe(199)
      expect(updated.inStock).toBe(false)
    }
  })

  it("should delete product", () => {
    const product = service.create(dto);

    service.delete(product.id);

    expect(products).toHaveLength(0)
  })

  it("should return undefined for deleted product", () => {
    const product = service.create(dto);

    service.delete(product.id);

    const result = service.findById(product.id);

    expect(result).toBeUndefined()
  })
});
