import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { App } from '../../src/app.js';
import { products } from '../../src/database/product.store.js';
import { randomUUID } from 'node:crypto';
import { Product } from '../../src/products/interfaces/product.interface.js';

const PRODUCT_DTO: Omit<Product, 'id'> = {
  name: "New Product",
  description: "Something very cool!",
  price: 1099,
  category: "electronics",
  inStock: true,
};

const PRODUCT_DTO_WITHOUT_FIELD: Partial<Product> = {
  name: "New Product",
  price: 1099,
  category: "electronics",
  inStock: true,
};

describe("E2E: Products API", () => {
  let app: App;

  beforeEach(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    products.length = 0;

    app = new App();
    await app.init();
  })

  afterEach(async () => {
    await app.app.close()
  })

  describe("GET /api/products", () => {
    it("should return 200 and empty array", async () => {
      const res = await app.app.inject({
        method: "GET",
        url: "/api/products"
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toEqual([])
    })
  })

  describe("GET /api/products/:productId", () => {
    it("should return 200 and the product if it exists", async () => {
      const created = await app.app.inject({
        method: "POST",
        url: "/api/products",
        body: PRODUCT_DTO
      });

      const res = await app.app.inject({
        method: "GET",
        url: `/api/products/${created.json().id}`
      });

      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject(PRODUCT_DTO);
    })

    it("should return 400 if productId is invalid (not uuid)", async () => {
      const res = await app.app.inject({
        method: "GET",
        url: "/api/products/1234"
      });

      expect(res.statusCode).toBe(400);
    })

    it("should return 404 if product doesn't exist", async () => {
      const uuid = randomUUID();

      const res = await app.app.inject({
        method: "GET",
        url: `/api/products/${uuid}`
      });

      expect(res.statusCode).toBe(404);
    })
  })

  describe("POST /api/products", () => {
    it("should return 201 and created product", async () => {
      const res = await app.app.inject({
        method: "POST",
        url: "/api/products",
        body: PRODUCT_DTO
      });

      expect(res.statusCode).toBe(201) 
      expect(res.json()).toMatchObject(PRODUCT_DTO)
    })

    it("should return 400 if required fields are missing", async () => {
      const res = await app.app.inject({
        method: "POST",
        url: "/api/products",
        body: PRODUCT_DTO_WITHOUT_FIELD
      })

      expect(res.statusCode).toBe(400)
    })

    it("should return 400 if price is not a positive number", async () => {
      const res = await app.app.inject({
        method: "POST",
        url: "/api/products",
        body: { ...PRODUCT_DTO, price: -10 }
      })

      expect(res.statusCode).toBe(400)
    })
  })

  describe("PUT /api/products/:productId", () => {
    it("should return 200 and the updated product", async () => {
      const product = await app.app.inject({
        method: "POST",
        url: "/api/products",
        body: PRODUCT_DTO
      })

      const updatedProduct = await app.app.inject({
        method: "PUT",
        url: `/api/products/${product.json().id}`,
        body: { ...PRODUCT_DTO, name: "iPad"}
      })

      expect(updatedProduct.statusCode).toBe(200)
      expect(updatedProduct.json()).not.toMatchObject(PRODUCT_DTO)
      expect(updatedProduct.json().name).toBe('iPad')
    })
  
    it("should return 404 if id doesn't exist", async () => {
      const res = await app.app.inject({
        method: "PUT",
        url: "/api/products/1234"
      });
  
      expect(res.statusCode).toBe(400);
    })
  })

  describe("DELETE /api/products/:productId", () => {
    it("should return 204 and product is deleted", async () => {
      const product = await app.app.inject({
        method: "POST",
        url: "/api/products",
        body: PRODUCT_DTO
      })

      const res = await app.app.inject({
        method: "DELETE",
        url: `/api/products/${product.json().id}`,
      })

      expect(res.statusCode).toBe(204)
      expect(products).toEqual([])
    })
  
    it("should return 400 if productId is invalid (not uuid)", async () => {
      const res = await app.app.inject({
        method: "DELETE",
        url: "/api/products/1234"
      });

      expect(res.statusCode).toBe(400);
    })

    it("should return 404 if product doesn't exist", async () => {
      const uuid = randomUUID();

      const res = await app.app.inject({
        method: "DELETE",
        url: `/api/products/${uuid}`
      });

      expect(res.statusCode).toBe(404);
    })
  })
})