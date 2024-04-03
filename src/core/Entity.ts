const months = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

export abstract class Entity {
	protected priceToFloat(price: string): number {
		return parseFloat(price.replaceAll(",", ".").replace(" zł", "").trim());
	}

	protected removeEndlines(text: string): string {
		return text.replaceAll("\n", "").trim();
	}

	protected stringToDate(dateString: string): Date {
		const [day, month, year] = dateString.split(" ");
		let monthNumber = 0;
		months.forEach((monthName, index) => {
			if (month.includes(monthName)) {
				monthNumber = index;
			}
		});
		return new Date(Number(year), monthNumber, Number(day));
	}
}
