import type { Product } from "../products/interfaces/product.interface.js";

export interface IStorageService {
	findAll(): Promise<Product[]>;
	findById(id: string): Promise<Product | undefined>;
	create(product: Product): Promise<Product>;
	update(id: string, data: Omit<Product, "id">): Promise<Product | null>;
	delete(id: string): Promise<boolean>;
}
