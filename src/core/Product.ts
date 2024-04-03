import { HTMLElement } from "node-html-parser";
import { Entity } from "./Entity";

export class Product extends Entity {
	public title: string;
	public subtitle: string;
	public totalPriceString: string;
	public packagePriceString: string;
	public totalPrice: number;
	public packagePrice: number;
	public quantity: number;

	private tag: string;

	constructor(tag: HTMLElement) {
		super();
		this.tag = tag.toString();
		const title = tag.querySelector("div.product-package__title");
		if (!title) {
			throw new Error(`Title not found for the product. Full tag: ${tag.text}`);
		}
		this.title = this.removeEndlines(title.text);

		const subtitle = tag.querySelector("div.product-package__subtitle");
		if (!subtitle) {
			throw new Error(`Subtitle not found for the product. Full tag: ${tag.text}`);
		}
		this.subtitle = this.removeEndlines(subtitle.text);

		const [totalPriceString, packagePriceString] = tag.querySelectorAll(
			"div.price-package__amount",
		);
		if (!totalPriceString || !packagePriceString) {
			throw new Error(`Price not found for the product. Full tag: ${tag.text}`);
		}
		this.totalPriceString = this.removeEndlines(totalPriceString.text);
		this.packagePriceString = this.removeEndlines(packagePriceString.text);
		this.totalPrice = this.priceToFloat(this.totalPriceString);
		this.packagePrice = this.priceToFloat(this.packagePriceString);
		const [quantity] = tag.querySelectorAll("div.product-package__qty");
		if (!quantity) {
			throw new Error(`Quantity not found for the product. Full tag: ${tag.text}`);
		}
		this.quantity = Number(this.removeEndlines(quantity.text));
	}

	public toString(): string {
		return `Product(${this.title}, ${this.quantity}) - ${this.totalPrice} PLN`;
	}
}
