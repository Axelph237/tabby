import ItemType from "~/lib/+types/item-type";
import type Item from "~/lib/+types/item";

const matcha = {
	id: "matcha-test-id",
	name: "Matcha Latte",
	desc: "Ceremonial grade matcha whisked and served atop whole cow’s milk. House cold foam available on request.",
	basePrice: 0,
	imgUrl:
		"https://i.pinimg.com/736x/e9/a6/9b/e9a69b322c3fdec10b5448e4616095d3.jpg",
	options: undefined,
};
export const matchaType = new ItemType(matcha);

const gibraltar = {
	id: "gibraltar-test-id",
	name: "Gibraltar",
	desc: "Equal parts craft-brewed espresso and fresh cow’s milk. A gentle, fruity flavor with a creamy mouthfeel.",
	basePrice: 0,
	imgUrl:
		"https://i.pinimg.com/736x/39/7f/80/397f8000561719de89e66f18a02f81d0.jpg",
	options: undefined,
};
export const gibraltarType = new ItemType(gibraltar);

export const tItemTypes: ItemType[] = [matchaType, gibraltarType];

const NUM_ITEMS = 6;
export const tItems: Item[] = [];
for (let i = 0; i < NUM_ITEMS; i++) {
	tItems.push(tItemTypes[i % tItemTypes.length].createItem());
}
