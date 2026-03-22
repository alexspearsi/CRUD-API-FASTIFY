import "dotenv/config";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import Fastify, {
	type FastifyError,
	type FastifyInstance,
	type FastifyReply,
	type FastifyRequest,
} from "fastify";
import { MemoryStorageService } from "./database/memory-storage.service.js";
import type { IStorageService } from "./database/storage.interface.js";
import { LoggerService } from "./logger/logger.service.js";
import { productRoutes } from "./products/product.routes.js";

const API_PREFIX = "/api";

export class App {
	app: FastifyInstance;
	port: number;
	env: string;

	constructor(private readonly storageService: IStorageService = new MemoryStorageService()) {
		this.storageService = storageService;

		this.app = Fastify({
			logger: false,
			ajv: {
				customOptions: {
					strict: false,
				},
			},
		});
		this.port = Number(process.env.PORT) || 4000;
		this.env = process.env.NODE_ENV || "development";
	}

	private logger = new LoggerService();

	private setupNotFoundHandler() {
		this.app.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) => {
			reply.code(404).send({
				message: `Route ${req.method} ${req.url} not found`,
			});
		});
	}

	private setErrorHandler() {
		this.app.setErrorHandler((error: FastifyError, _req: FastifyRequest, reply: FastifyReply) => {
			if ("validation" in error) {
				return reply.code(400).send({
					message: error.message,
					details: error.validation,
				});
			}

			reply.code(500).send({
				message: "Internal Server Error",
			});
		});
	}

	public async init(port?: number): Promise<void> {
		const listenPort = port ?? this.port;

		await this.app.register(swagger, {
			openapi: {
				info: {
					title: "CRUD API ON FASTIFY",
					version: "1.0.0",
				},
			},
		});

		await this.app.register(swaggerUI, {
			routePrefix: "/docs",
		});

		this.app.addHook("onResponse", async (req: FastifyRequest, reply: FastifyReply) => {
			if (!req.url.startsWith(API_PREFIX)) {
				return;
			}

			const ms = Math.round(reply.elapsedTime);
			const message = `[port ${listenPort}] ${req.method} ${req.url} ${reply.statusCode} (${ms}ms)`;

			if (reply.statusCode >= 500) {
				this.logger.error(message);
			} else if (reply.statusCode >= 400) {
				this.logger.warn(message);
			} else {
				this.logger.info(message);
			}
		});

		this.app.register(productRoutes, {
			prefix: "/api/products",
			storageService: this.storageService,
		});

		this.setupNotFoundHandler();
		this.setErrorHandler();

		if (process.env.NODE_ENV !== "test") {
			await this.app.listen({ port: listenPort });

			this.logger.info(`Сервер запущен на http://localhost:${this.port}`);
		} else {
			await this.app.ready();
		}
	}
}
