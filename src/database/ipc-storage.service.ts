import type { Product } from "../products/interfaces/product.interface.js";
import type { IStorageService } from "./storage.interface.js";

interface IpcResponse {
	id: number;
	result: unknown;
}

export class IpcStorageService implements IStorageService {
	private counter = 0;
	private pending = new Map<number, (result: unknown) => void>();

	constructor() {
		process.on("message", (msg: IpcResponse) => {
			const resolve = this.pending.get(msg.id);
			if (resolve) {
				this.pending.delete(msg.id);
				resolve(msg.result);
			}
		});
	}

	private send<T>(type: string, payload?: unknown): Promise<T> {
		return new Promise((resolve) => {
			const id = this.counter++;
			this.pending.set(id, resolve as (result: unknown) => void);
			process.send?.({ id, type, payload });
		});
	}

	findAll() {
		return this.send<Product[]>("FIND_ALL");
	}

	findById(id: string) {
		return this.send<Product | undefined>("FIND_BY_ID", id);
	}

	create(product: Product) {
		return this.send<Product>("CREATE", product);
	}

	update(id: string, data: Omit<Product, "id">) {
		return this.send<Product | null>("UPDATE", { id, data });
	}

	delete(id: string) {
		return this.send<boolean>("DELETE", id);
	}
}
