import { randomUUID } from "node:crypto";
import { products } from "../database/product.store.js";
import type { Product } from "./interfaces/product.interface.js";
import type { ProductDto } from './dto/product.dto.js';

export class ProductService {
	private products = products;

	findAll() {
		return this.products;
	}

	findById(id: string): Product | undefined {
		return this.products.find((product) => product.id === id);
	}

	create(data: ProductDto): Product {
		const product: Product = {
			id: randomUUID(),
			...data,
		};

		this.products.push(product);

		return product;
	}

	update(id: string, data: ProductDto): Product | null {
		const product = this.findById(id);

		if (!product) {
			return null;
		}

		Object.assign(product, {
			id: product.id,
			...data,
		});

		return product;
	}

	delete(id: string): boolean {
		const index = this.products.findIndex((p) => p.id === id);

		if (index === -1) {
			return false;
		}

		this.products.splice(index, 1);

		return true;
	}
}
