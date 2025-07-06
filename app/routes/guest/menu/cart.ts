import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import type { Item } from "./menu.validation";

const LineItemObj = t.Integer();
type TLineItem = Static<typeof LineItemObj>;

const CartObj = t.Object({
	items: t.Record(t.Integer(), LineItemObj),
});
type TCart = Static<typeof CartObj>;

type ItemId = number | string;

export interface CartInit {
	items: Record<ItemId, TLineItem>;
}

export default class Cart {
	private items: Record<ItemId, TLineItem> = {};

	constructor(init?: TCart) {
		if (init !== undefined) {
			this.items = init.items;
		}
	}

	static isCart = (o: any): boolean => Value.Check(CartObj, o);

	getItems = () => this.items;

	private setItems = (items: Record<ItemId, TLineItem>) => (this.items = items);

	getNumItems = () => {
		let total = 0;
		// Currently the line item itself is the number of items
		for (const k in this.getItems()) {
			total += this.getItems()[k];
		}
		return total;
	};

	setItem = (id: ItemId, count: number) => (this.getItems()[id] = count);

	addItem = (id: ItemId, count: number) => {
		this.getItems()[id] = this.getItems()[id]
			? this.getItems()[id] + count
			: count;

		if (this.getItems()[id] <= 0) delete this.getItems()[id];
	};

	removeItem = (id: ItemId) => delete this.getItems()[id];

	toObject = () => ({ items: this.getItems() });

	validateEntries = (validItems: Item[]) => {
		const verifiedItems: Record<ItemId, TLineItem> = {};

		const currItems = this.getItems();

		for (const v of validItems) {
			if (currItems[v.id]) {
				verifiedItems[v.id] = currItems[v.id];
			}
		}

		this.setItems(verifiedItems);

		return this;
	};

	static save = (key: string, cart: Cart) =>
		sessionStorage.setItem(key, JSON.stringify(cart));

	static get = (key: string): Cart => {
		// TODO update items in cart to mirror potential changes on menu
		// i.e. price changes, options being removed, etc.
		const cartData = sessionStorage.getItem(key);
		// Parse empty string if data is null; "" will fail isCart test

		const parsedData = JSON.parse(cartData ?? "{}");

		return new Cart(Cart.isCart(parsedData) ? parsedData : undefined);
	};
}
