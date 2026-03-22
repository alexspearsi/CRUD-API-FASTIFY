import type { Product } from "../products/interfaces/product.interface.js";
import type { IStorageService } from "./storage.interface.js";

export class MemoryStorageService implements IStorageService {
	products: Product[] = [];

	async findAll() {
		return this.products;
	}

	async findById(id: string) {
		return this.products.find((product) => product.id === id);
	}

	async create(product: Product) {
		this.products.push(product);

		return product;
	}

	async update(id: string, data: Omit<Product, "id">) {
		const product = this.products.find((product) => product.id === id);

		if (!product) {
			return null;
		}

		Object.assign(product, data);

		return product;
	}

	async delete(id: string) {
		const index = this.products.findIndex((product) => product.id === id);

		if (index === -1) {
			return false;
		}

		this.products.splice(index, 1);

		return true;
	}
}
