import { App } from "./app.js";

async function bootstrap() {
	const app = new App();

	await app.init();

	const shutdown = async () => {
		console.log("Server shutting down...");
		await app.app.close();
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
}

bootstrap();
