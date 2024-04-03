import { parse } from "node-html-parser";
import { stringify } from "querystring";
import { Order, Product } from ".";

interface AuthenticationParams {
	username?: string;
	password?: string;
}

interface OrdersPagination {
	start?: number;
	maxOrders?: number;
}

export class Hebe {
	private readonly baseUrl = "https://www.hebe.pl";

	public token?: string;
	public username: string;
	public password: string;

	constructor({ username, password }: AuthenticationParams = {}) {
		this.username = username ?? "";
		this.password = password ?? "";
	}

	/**
	 * Obtains `this.token` with optionally specified credentials. If not specified, credentials from constructor are to be used.
	 *
	 * @param authenticationParams - optional, if specified will override set on contructor `this.username` and `this.password`
	 */
	public authenticate = async ({
		username,
		password,
	}: AuthenticationParams = {}): Promise<void> => {
		if (username) {
			this.username = username;
		}
		if (password) {
			this.password = password;
		}
		const { csrfToken, dwsidToken } = await this.obtainInitialToken();
		this.token = await this.obtainAuthDwsidToken(dwsidToken, csrfToken);
	};

	/**
	 * Retrieves users orders. Authenticates if not authenticated
	 *
	 * @param OrdersPagination: optional, if not specified, `maxOrders=100` and `start=0`
	 * @returns a list of Order class
	 */
	public getOrders = async ({ maxOrders, start }: OrdersPagination = {}): Promise<Order[]> => {
		if (!this.token) {
			await this.authenticate();
		}
		if (!maxOrders) {
			maxOrders = 100;
		}
		if (!start) {
			start = 0;
		}
		const orders: Order[] = [];
		for (let i = start; i < maxOrders; i += 5) {
			const ordersBatch = await this.obtainOrders(i * 5);
			if (ordersBatch.length === 0) {
				break;
			}
			orders.push(...ordersBatch);
		}
		return orders.slice(0, maxOrders);
	};

	/**
	 * Retrieves products for a particular order. Authenticates if not authenticated
	 *
	 * @param order - instance of an Order class to retrieve the products for
	 * @returns a list of Product class instances
	 */
	public getProducts = async (order: Order): Promise<Product[]> => {
		if (!this.token) {
			await this.authenticate();
		}
		const url = `${this.baseUrl}/on/demandware.store/Sites-Hebe-Site/en_US/Order-Orders`;
		const body = stringify({
			[`dwfrm_orders_orderlist_i${order.position}_show`]: "POKA%C5%BB+SZCZEG%C3%93%C5%81Y",
		});
		const response = await fetch(url, {
			method: "POST",
			headers: this.headers,
			body,
		});
		if (response.status !== 200) {
			throw new Error(
				`Product retrieval failed, status code: ${response.status}, url: ${url}`,
			);
		}
		const txt = await response.text();
		const root = parse(txt);
		const productsRaw = root.querySelectorAll("div.product-package__row");
		productsRaw.shift();

		return productsRaw.map((productRaw) => new Product(productRaw));
	};

	/**
	 * Retrieves all products for by default maximum of 100 orders
	 *
	 * @param params - Orders pagination params, optional.
	 * @returns all products for all orders in the account. By default maximum of 100 orders products
	 */
	public getAllProducts = async (params: OrdersPagination = {}): Promise<Product[]> => {
		const orders = await this.getOrders(params);
		let products: Product[] = [];
		for (const order of orders) {
			products = products.concat(await this.getProducts(order));
		}
		return products;
	};

	private obtainOrders = async (start: number = 0): Promise<Order[]> => {
		const url = `${this.baseUrl}/orders?order_status=1&start=${start}`;
		const response = await fetch(url, {
			headers: this.headers,
		});
		if (response.status !== 200) {
			throw new Error(
				`Orders retrieval failed, status code: ${response.status}, url: ${url}`,
			);
		}
		const txt = await response.text();
		if (!txt.includes("orders-detail__section")) {
			return [];
		}
		const root = parse(txt);
		const ordersDetails = root.querySelectorAll(".orders-detail__section");
		const orders = ordersDetails.map(
			(orderDetails, index) => new Order(orderDetails, start + index),
		);
		return orders;
	};

	private obtainAuthDwsidToken = async (
		initialDwsidToken: string,
		csrfToken: string,
	): Promise<string> => {
		const url = `${this.baseUrl}/on/demandware.store/Sites-Hebe-Site/en_US/Login-LoginForm`;
		const headers = {
			...this.headers,
			Cookie: `dwsid=${initialDwsidToken};`,
		};
		const body = stringify({
			dwfrm_login_username_d0uexrwjfbur: this.username,
			dwfrm_login_password_d0vyhxgwmmwx: this.password,
			csrf_token: csrfToken,
			dwfrm_login_login: "",
			format: "ajax",
		});
		const response = await fetch(url, {
			method: "POST",
			headers,
			body,
		});
		if (response.status !== 200) {
			throw new Error(`Authentication failed, status code: ${response.status}`);
		}
		const { error, status } = JSON.parse(await response.text());
		if (error || status !== "SUCCESS") {
			throw new Error(`Authentication failed: ${error}. Status: ${status}`);
		}
		const dwsidCookie = response.headers
			.getSetCookie()
			.find((cookie) => cookie.includes("dwsid"));
		if (!dwsidCookie) {
			throw new Error("dwsid cookie is not present in the initial token retrieval");
		}
		const dwsidToken = dwsidCookie.split("dwsid=")[1].split(";")[0];
		if (!dwsidToken || typeof dwsidToken !== "string") {
			throw new Error("dwsidToken is not present in the initial token retrieval");
		}
		return dwsidToken;
	};

	private obtainInitialToken = async (): Promise<{ csrfToken: string; dwsidToken: string }> => {
		const response = await fetch(this.baseUrl);
		const dwsidCookie = response.headers
			.getSetCookie()
			.find((cookie) => cookie.includes("dwsid"));
		const txt = await response.text();
		if (!dwsidCookie) {
			throw new Error("dwsid cookie is not present in the initial token retrieval");
		}
		const dwsidToken = dwsidCookie.split("dwsid=")[1].split(";")[0];

		const csrfRaw = txt?.split("window.CSRFToken = ")[1]?.split(";")[0];
		if (!csrfRaw) {
			throw new Error("csrfToken is not present in the initial token retrieval");
		}
		const csrfJson = JSON.parse(csrfRaw);
		const csrfToken = csrfJson?.value;
		if (!csrfToken || typeof csrfToken !== "string") {
			throw new Error("csrfToken is not present in the initial token retrieval");
		}
		return {
			csrfToken,
			dwsidToken,
		};
	};

	private get headers() {
		return {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"X-Requested-With": "XMLHttpRequest",
			Origin: this.baseUrl,
			Referer: `${this.baseUrl}/home?showform=true&targeturl=%2Faccount`,
			...(this.token && {
				Cookie: `dwsid=${this.token}`,
			}),
		};
	}
}
