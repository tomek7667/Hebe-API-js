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

// efrom .entity import Entity
// from bs4.element import Tag

// class Order(Entity):
//     def __init__(self, order_details_section: Tag, position: int):
//         self.position = position
//         self._tag = order_details_section
//         [date, price, packs] = order_details_section.find_all(
//             "span", class_="order-header__value"
//         )
//         self.date: str = date.text
//         self.price_str: str = price.text
//         self.price: float = self._price_to_float(self.price_str)
//         self.packs: int = int(packs.text)
//         [order_id] = order_details_section.find_all(
//             "span", class_="order-header__number-value"
//         )
//         self.id: str = order_id.text

//     def __repr__(self) -> str:
//         return f"Order({self.id}, {self.position}): {self.date} - {self.price}"
