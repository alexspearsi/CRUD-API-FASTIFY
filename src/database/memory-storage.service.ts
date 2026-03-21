import type { Product } from "../products/interfaces/product.interface.js";
import type { IStorageService } from "./storage.interface.js";

export class MemoryStorageService implements IStorageService {
	products: Product[] = [];

	async readDB(): Promise<Product[]> {
		return this.products;
	}

	async writeDB(data: Product[]): Promise<void> {
		this.products = [...data];
	}
}
