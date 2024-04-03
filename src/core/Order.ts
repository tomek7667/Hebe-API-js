import { HTMLElement } from "node-html-parser";
import { Entity } from "./Entity";

export class Order extends Entity {
	public readonly id: string;
	public position: number;
	public dateString: string;
	public date: Date;
	public priceString: string;
	public price: number;
	public packs: number;

	private tag: string;

	constructor(tag: HTMLElement, position: number) {
		super();
		this.tag = tag.toString();
		this.position = position;
		const [date, price, packs] = tag.querySelectorAll("span.order-header__value");
		this.dateString = date.text;
		this.date = this.stringToDate(this.dateString);
		this.priceString = price.text;

		this.price = Number(this.priceToFloat(this.priceString));
		this.packs = Number(packs.text);
		const [orderId] = tag.querySelectorAll("span.order-header__number-value");
		this.id = orderId.text;
	}

	public toString(): string {
		return `Order(${this.id}, ${this.position}): ${this.dateString} - ${this.price}`;
	}
}
