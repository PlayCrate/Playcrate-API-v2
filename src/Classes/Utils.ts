export class Utils {
	public static New() {
		return new Utils();
	}

	public async Sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
