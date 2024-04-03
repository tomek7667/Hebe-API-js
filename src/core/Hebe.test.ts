import { Hebe } from "./Hebe";
import { config } from "dotenv";

config();
const { HEBE_USERNAME, HEBE_PASSWORD } = process.env;

if (!HEBE_USERNAME || !HEBE_PASSWORD) {
	throw new Error("Valid HEBE_USERNAME and HEBE_PASSWORD needed in environment variables");
}

describe("Hebe api", () => {
	it("authenticates successfully via constructor", async () => {
		const hebe = new Hebe({
			username: HEBE_USERNAME,
			password: HEBE_PASSWORD,
		});
		await hebe.authenticate();
		expect(typeof hebe.token === "string" && hebe.token.length > 0).toBe(true);
	});

	it("authenticates successfully via authenticate method", async () => {
		const hebe = new Hebe();
		await hebe.authenticate({
			username: HEBE_USERNAME,
			password: HEBE_PASSWORD,
		});
		expect(typeof hebe.token === "string" && hebe.token.length > 0).toBe(true);
	});
});
