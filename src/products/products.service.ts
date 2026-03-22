import { randomUUID } from "node:crypto";
import type { IStorageService } from "../database/storage.interface.js";
import type { ProductDto } from "./dto/product.dto.js";
import type { Product } from "./interfaces/product.interface.js";

export class ProductService {
	constructor(private readonly storageService: IStorageService) {}

	async findAll(): Promise<Product[]> {
		return this.storageService.findAll();
	}

	async findById(id: string): Promise<Product | undefined> {
		return this.storageService.findById(id);
	}

	async create(data: ProductDto): Promise<Product> {
		return this.storageService.create({ id: randomUUID(), ...data });
	}

	async update(id: string, data: ProductDto): Promise<Product | null> {
		return this.storageService.update(id, data);
	}

	async delete(id: string): Promise<boolean> {
		return this.storageService.delete(id);
	}
}
