import { validate } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { products } from "../../src/database/product.store.js";
import { ProductService } from "../../src/products/products.service.js";

const UPDATED_PRICE = 199;

const PRODUCT_DTO = {
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
}

describe("Product Service", () => {
	let service: ProductService;

	beforeEach(() => {
    products.length = 0
		service = new ProductService();
	});

  it("should return empty array", () => {
    expect(products).toHaveLength(0)
  })

	it("should create a new product", () => {
		const product = service.create(PRODUCT_DTO);

		expect(product).toMatchObject(PRODUCT_DTO);
    expect(validate(product.id)).toBe(true);
		expect(products).toContainEqual(product);
	});

  it("should find product by id", () => {
    const product = service.create(PRODUCT_DTO);

    const found = service.findById(product.id);

    expect(found).toEqual(product)
  })

  it("should update product", () => {
    const product = service.create(PRODUCT_DTO);

    const updated = service.update(product.id, UPDATED_PRODUCT_DTO)

    if (updated) {
      expect(updated.id).toBe(product.id)
      expect(updated).toMatchObject(UPDATED_PRODUCT_DTO)
      expect(updated.price).toBe(UPDATED_PRICE)
      expect(updated.inStock).toBe(false)
    }
  })

  it("should delete product", () => {
    const product = service.create(PRODUCT_DTO);

    service.delete(product.id);

    expect(products).toHaveLength(0)
  })

  it("should return undefined for deleted product", () => {
    const product = service.create(PRODUCT_DTO);

    service.delete(product.id);

    const result = service.findById(product.id);

    expect(result).toBeUndefined()
  })
});
