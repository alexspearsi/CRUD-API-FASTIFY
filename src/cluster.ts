import "dotenv/config";
import cluster from "node:cluster";
import http from "node:http";
import os from "node:os";
import type { Product } from "./products/interfaces/product.interface.js";

const PORT = Number(process.env.PORT) || 4000;
const WORKERS_COUNT = os.availableParallelism() - 1;

interface IpcMessage {
	id: number;
	type: string;
	payload?: unknown;
}

if (cluster.isPrimary) {
	const db: Product[] = [];

	console.log(`Load balancer on http://localhost:${PORT}/api`);

	for (let i = 0; i < WORKERS_COUNT; i++) {
		const workerPort = PORT + 1 + i;
		const worker = cluster.fork({ PORT: String(workerPort) });

		console.log(`Worker ${i + 1} on http://localhost:${workerPort}/api`);

		worker.on("message", (msg: IpcMessage) => {
			let result: unknown;

			switch (msg.type) {
				case "FIND_ALL": {
					result = [...db];
					break;
				}

				case "FIND_BY_ID": {
					result = db.find((product) => product.id === msg.payload);
					break;
				}

				case "CREATE": {
					db.push(msg.payload as Product);
					result = msg.payload;
					break;
				}

				case "UPDATE": {
					const { id, data } = msg.payload as { id: string; data: Omit<Product, "id"> };
					const product = db.find((product) => product.id === id);

					if (product) {
						Object.assign(product, data);
					}

					result = product ?? null;

					break;
				}

				case "DELETE": {
					const index = db.findIndex((product) => product.id === msg.payload);

					if (index !== -1) {
						db.splice(index, 1);
					}

					result = index !== -1;
					break;
				}
			}

			worker.send({ id: msg.id, result });
		});

		worker.on("exit", () => {
			console.log(`Worker ${workerPort} died, Restarting...`);
			cluster.fork({ PORT: String(workerPort) });
		});
	}

	let current = 0;

	const server = http.createServer((req, res) => {
		const workerIndex = current % WORKERS_COUNT;
		current = (current + 1) % WORKERS_COUNT;
		const workerPort = PORT + 1 + workerIndex;

		const proxyReq = http.request(
			{
				hostname: "localhost",
				port: workerPort,
				path: req.url,
				method: req.method,
				headers: req.headers,
			},
			(proxyRes) => {
				res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
				proxyRes.pipe(res);
			},
		);

		proxyReq.on("error", () => {
			res.writeHead(502);
			res.end(JSON.stringify({ message: "Bad Gateway" }));
		});

		req.pipe(proxyReq);
	});

	server.listen(PORT);
} else {
	const { App } = await import("./app.js");
	const { IpcStorageService } = await import("./database/ipc-storage.service.js");

	const storage = new IpcStorageService();
	const app = new App(storage);
	await app.init();
}
