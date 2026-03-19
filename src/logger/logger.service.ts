export class LoggerService {
	gettime() {
		const now = new Date();

		return now.toISOString().replace("T", " ").substring(0, 19);
	}

	private colors = {
		reset: "\x1b[0m",
		blue: "\x1b[94m",
		orange: "\x1b[38;5;208m",
		red: "\x1b[38;5;196m",
	};

	info(message: string) {
		console.log(
			`${this.gettime()} ${this.colors.blue}INFO${this.colors.reset}: ${message}`,
		);
	}

	warn(message: string) {
		console.log(
			`${this.gettime()} ${this.colors.orange}WARN${this.colors.reset}: ${message}`,
		);
	}

	error(message: string) {
		console.error(
			`${this.gettime()} ${this.colors.red}ERROR${this.colors.reset}: ${message}`,
		);
	}
}
