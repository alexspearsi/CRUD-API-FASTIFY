import type { Product } from "../products/interfaces/product.interface.js";

export interface IStorageService {
	readDB(): Promise<Product[]>;
	writeDB(data: Product[]): Promise<void>;
}
