import { randomUUID } from "crypto";
import type { Product } from "../products/interfaces/product.interface.js";
import type { IStorageService } from "./storage.interface.js";

interface IpcResponse {
	id: string;
	result: unknown;
}

export class IpcStorageService implements IStorageService {
	private pending = new Map<string, (result: unknown) => void>();

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
			const id = randomUUID();
			this.pending.set(id, resolve as (result: unknown) => void);
			process.send!({ id, type, payload });
		});
	}

	async readDB(): Promise<Product[]> {
		return this.send<Product[]>("READ_ALL");
	}

	async writeDB(data: Product[]): Promise<void> {
		await this.send<void>("WRITE_ALL", data);
	}
}
