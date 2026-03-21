import { randomUUID } from "node:crypto";
import type { IStorageService } from "../database/storage.interface.js";
import type { ProductDto } from "./dto/product.dto.js";
import type { Product } from "./interfaces/product.interface.js";

export class ProductService {
	constructor(private readonly storageService: IStorageService) {}

	async findAll(): Promise<Product[]> {
		return this.storageService.readDB();
	}

	async findById(id: string): Promise<Product | undefined> {
		const products = await this.storageService.readDB();

		return products.find((product) => product.id === id);
	}

	async create(data: ProductDto): Promise<Product> {
		const products = await this.storageService.readDB();

		const product: Product = {
			id: randomUUID(),
			...data,
		};

		products.push(product);

		await this.storageService.writeDB(products);

		return product;
	}

	async update(id: string, data: ProductDto): Promise<Product | null> {
		const products = await this.storageService.readDB();

		const product = products.find((product) => product.id === id);

		if (!product) {
			return null;
		}

		Object.assign(product, data);

		await this.storageService.writeDB(products);

		return product;
	}

	async delete(id: string): Promise<boolean> {
		const products = await this.storageService.readDB();

		const index = products.findIndex((p) => p.id === id);

		if (index === -1) {
			return false;
		}

		products.splice(index, 1);

		await this.storageService.writeDB(products);

		return true;
	}
}
