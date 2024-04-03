import { stringify } from "querystring";

export class Hebe {
	private readonly noTokenError = "Use hebe.authenticate() in order to obtain the token";
	private readonly baseUrl = "https://www.hebe.pl";

	public token?: string;
	public username: string;
	public password: string;

	constructor({ username, password }: { username?: string; password?: string } = {}) {
		this.username = username ?? "";
		this.password = password ?? "";
	}

	public authenticate = async ({
		username,
		password,
	}: {
		username?: string;
		password?: string;
	} = {}): Promise<void> => {
		if (username) {
			this.username = username;
		}
		if (password) {
			this.password = password;
		}
		const { csrfToken, dwsidToken } = await this.obtainInitialToken();
		this.token = await this.obtainAuthDwsidToken(dwsidToken, csrfToken);
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
