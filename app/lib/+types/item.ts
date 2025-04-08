import ItemType, { type ItemOptionSelection } from "~/lib/+types/item-type";

export default class Item {
	readonly typeId: string;
	readonly selectKey: string;
	readonly totalPrice: number;

	constructor(type: ItemType, optSelections: ItemOptionSelection[]) {
		// ID
		this.typeId = type.id;

		// SELECT KEY
		// sort option value sets, then sort options
		for (let i = 0; i < optSelections.length; i++) {
			if (optSelections[i].valueSet) {
				// Array type
				optSelections[i].valueSet!.sort((a, b) =>
					a.label.localeCompare(b.label),
				);
			}
		}
		optSelections.sort((a, b) => a.optName.localeCompare(b.optName));
		this.selectKey = JSON.stringify(optSelections);

		// TOTAL PRICE
		let totalPrice = type.basePrice;
		for (let i = 0; i < optSelections.length; i++) {
			// multiselect items
			if (optSelections[i].valueSet) {
				for (let j = 0; j < optSelections[i].valueSet!.length; j++) {
					totalPrice += optSelections[i].valueSet![j].priceAdj;
				}
			}
			// text items
			else if (optSelections[i].value) {
				totalPrice += optSelections[i].value!.priceAdj;
			}
		}
		this.totalPrice = totalPrice;
	}

	getSelections = () => {
		return JSON.parse(this.selectKey);
	};

	toString = () => {
		return JSON.stringify({
			typeId: this.typeId,
			selectKey: this.selectKey,
			totalPrice: this.totalPrice,
		});
	};
}
