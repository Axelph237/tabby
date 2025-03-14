import ItemType, { type Item } from "~/lib/item";

export const matcha = new ItemType(
	"",
	"Matcha Latte",
	"Ceremonial grade matcha whisked and served atop whole cow’s milk. House cold foam available on request.",
	0,
	"https://i.pinimg.com/736x/e9/a6/9b/e9a69b322c3fdec10b5448e4616095d3.jpg",
);
export const gibraltar = new ItemType(
	"",
	"Gibraltar",
	"Equal parts craft-brewed espresso and fresh cow’s milk. A gentle, fruity flavor with a creamy mouthfeel.",
	0,
	"https://i.pinimg.com/736x/39/7f/80/397f8000561719de89e66f18a02f81d0.jpg",
);

export const tItemTypes: ItemType[] = [matcha, gibraltar];

const NUM_ITEMS = 6;
export const tItems: Item[] = [];
for (let i = 0; i < NUM_ITEMS; i++) {
	const rndIndex = Math.floor(Math.random() * tItemTypes.length);

	tItems.push(tItemTypes[rndIndex].createItem([]));
}
