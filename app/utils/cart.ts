import { Type as t, type Static } from "@sinclair/typebox";
import { Nullable } from "~/utils/types/nullable";
import { Value } from "@sinclair/typebox/value";

export const cartItemObj = t.Object({
	id: t.Integer(),
	name: t.String(),
	description: t.Optional(Nullable(t.String())),
	img_url: t.Optional(Nullable(t.String({ format: "uri" }))),
	count: t.Integer(),
	unit_price: t.Integer(),
	selections: t.Array(t.Integer()), // Array of selection ids
});
export type CartItem = Static<typeof cartItemObj>;

export const cartDataObj = t.Object({
	items: t.Array(cartItemObj),
	totalCost: t.Integer(),
});
export type CartData = Static<typeof cartDataObj>;

/**
 * Handles item similarities and item counts.
 */
export default class Cart {
	readonly items: CartItem[];
	totalCost: number;
	numLineItems: number;

	constructor(cart?: CartData) {
		if (cart?.items) {
			this.items = cart.items;
			this.totalCost = cart.totalCost;

			this.numLineItems = 0;
			for (const item of cart?.items) this.numLineItems += item.count;
		} else {
			this.items = [];
			this.totalCost = 0;
			this.numLineItems = 0;
		}
	}

	/**
	 * Checks if a given piece of data is a cart object.
	 */
	static isCart(data: any): boolean {
		return Value.Check(cartDataObj, data);
	}

	/**
	 * Finds an item in the cart.
	 * @param item - The `CartItem` to search for, based on `id` and `selections`.
	 * @returns The `index` at which a matching item was found, or -1 if no item was found.
	 */
	findItem = (item: CartItem): number => {
		item.selections.sort((a, b) => a - b);

		// Macro isSameItem
		const isSameItem = (a: CartItem, b: CartItem): boolean => {
			if (a.id !== b.id || a.selections?.length !== b.selections?.length)
				return false;

			for (let i = 0; i < a.selections.length; i++)
				if (a.selections[i] !== b.selections[i]) return false;

			return true;
		};

		for (let i = 0, l = this.items.length; i < l; i++)
			if (isSameItem(this.items[i], item)) return i;

		return -1;
	};

	/**
	 * Finds all items that share an id, regardless of selections.
	 * @param itemId - The item id to search for.
	 */
	findItemFamily = (itemId: number): CartItem[] => {
		const family = [];
		for (const item of this.items) if (item.id === itemId) family.push(item);

		return family;
	};

	/**
	 * Adds an item to the cart. Increments the count of an item if the item already exists.
	 * @param item - The `CartItem` to add.
	 */
	addItem = (item: CartItem) => {
		const index = this.findItem(item);

		if (index >= 0) this.items[index].count += item.count;
		else this.items.push(item);

		this.totalCost += item.count * item.unit_price;
		this.numLineItems += item.count;
	};

	/**
	 * Decrements the count of an item in the cart, removing it if the count is <= to 0.
	 * @param item - The `CartItem` to remove.
	 */
	removeItem = (item: CartItem) => {
		const index = this.findItem(item);
		if (index < 0) return;

		const numRemoved = Math.min(item.count, this.items[index].count);
		if (numRemoved == this.items[index].count)
			// Remove item
			this.items.splice(index, 1); // Decrement item
		else this.items[index].count -= item.count;

		this.totalCost -= numRemoved * item.unit_price;
		this.numLineItems -= numRemoved;
	};

	/**
	 * Converts the cart instance to an object.
	 */
	toObject = (): CartData => ({
		items: this.items,
		totalCost: this.totalCost,
	});
}
