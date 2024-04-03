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

	it("obtains orders for authenticated user", async () => {
		const hebe = new Hebe({
			username: HEBE_USERNAME,
			password: HEBE_PASSWORD,
		});
		await hebe.authenticate();
		const orders = await hebe.getOrders({ maxOrders: 1 });
		expect(orders.length).toBe(1);
	});

	it("obtains many orders for authenticated user", async () => {
		const hebe = new Hebe({
			username: HEBE_USERNAME,
			password: HEBE_PASSWORD,
		});
		await hebe.authenticate();
		const orders = await hebe.getOrders({ maxOrders: 10 });
		expect(orders.length).toBe(10);
	});

	it("obtains products for particular order", async () => {
		const hebe = new Hebe({
			username: HEBE_USERNAME,
			password: HEBE_PASSWORD,
		});
		await hebe.authenticate();
		const orders = await hebe.getOrders({ maxOrders: 1 });
		expect(orders.length).toBe(1);
		const products = await hebe.getProducts(orders[0]);
		expect(products.length > 0).toBe(true);
	});

	it("obtains all products", async () => {
		const hebe = new Hebe({
			username: HEBE_USERNAME,
			password: HEBE_PASSWORD,
		});
		await hebe.authenticate();
		const products = await hebe.getAllProducts();
		expect(products.length > 0).toBe(true);
	}, 60_000);
});
