import { Type as t, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { itemSelectTObj, type Item } from "./menu.validation";
import { Nullable } from "~/utils/types/nullable";
import { uuidObj, type UUID } from "~/utils/types/uuid";
// import { randomUUID, type UUID } from "crypto";

// Represents an item that has been customized by the user
const LineItemObj = t.Object({
	count: t.Integer(),
	selections: t.Array(itemSelectTObj),
	notes: t.Optional(Nullable(t.String())),
});
type TLineItem = Static<typeof LineItemObj>;

// Represents the parent item containing a list of line items, identified by its
const CartItemObj = t.Object({
	// Under an items id, it may have variants with customizations from the user
	totalCount: t.Integer(),
	lineItems: t.Record(uuidObj, LineItemObj),
});
type TCartItem = Static<typeof CartItemObj>;

// Represents the Cart class structure in object form
const CartObj = t.Object({
	items: t.Record(t.Integer(), CartItemObj),
});
type TCart = Static<typeof CartObj>;
type UnfoldedCart = Array<
	{ id: ItemId; lineItems: Array<{ id: UUID } & TLineItem> } & Omit<
		TCartItem,
		"lineItems"
	>
>;

// Represents the possible typings for an item's id
type ItemId = number | string;

export interface CartInit {
	items: Record<ItemId, TCartItem>;
}

export default class Cart {
	private items: Record<ItemId, TCartItem> = {};

	constructor(init?: TCart) {
		if (init !== undefined) {
			this.items = init.items;
		}
	}

	static isCart = (o: any): boolean => Value.Check(CartObj, o);

	// TODO determine if this is a safe way to pass the items considering it is by reference
	/**
	 * Gets all parent item objects in the cart.
	 * @returns an Record containing item ids as the key and objects describing their variants as the value.
	 */
	getItems = () => this.items;

	/**
	 * Sets the items of this Cart object.
	 * @param items
	 */
	private setItems = (items: Record<ItemId, TCartItem>) => (this.items = items);

	/**
	 * Gets the total number of items (including the number of variants) of each item in the Cart.
	 * @returns an integer representing the total number of items in the cart.
	 */
	getNumItems = () => {
		let total = 0;
		// Currently the line item itself is the number of items
		for (const k in this.getItems()) {
			total += this.getItems()[k].totalCount;
		}
		return total;
	};

	// Privated as direct setting of item parents should be discouraged
	private setItem = (id: ItemId, lineItem: TCartItem) =>
		(this.getItems()[id] = lineItem);

	// Commented as this code no longer functions due to the change of how LineItems are structured
	// addItem = (id: ItemId, count: number) => {
	// 	this.getItems()[id] = this.getItems()[id]
	// 		? this.getItems()[id] + count
	// 		: count;

	// 	if (this.getItems()[id] <= 0) delete this.getItems()[id];
	// };

	// Privates as direct removal of item parents should be discouraged
	private removeItem = (id: ItemId) => delete this.getItems()[id];

	// # Line Item methods
	/**
	 * Updates an existing line item.
	 * @param itemId the item id of the line item parent.
	 * @param lineItemId the uuid of the line item.
	 * @param changes an object containing all fields to update in the line item.
	 */
	updateLineItem = (
		itemId: ItemId,
		lineItemId: UUID,
		changes: Partial<TLineItem>,
	) => {
		const cartItem = this.items[itemId];

		// Update line item with spreads
		const lineItem = cartItem.lineItems[lineItemId];
		const prevCount = lineItem.count; // Saved for later in function

		cartItem.lineItems[lineItemId] = {
			...lineItem,
			...changes,
		};

		// Update cartItem total count
		const countDiff = prevCount - cartItem.lineItems[lineItemId].count;
		cartItem.totalCount += countDiff;
	};

	/**
	 * Creates a new line item under the given item id.
	 * @param itemId the item id to create the line item under.
	 * @param lineItem the line item to create.
	 */
	createLineItem = (itemId: ItemId, lineItem: TLineItem) => {
		const cartItem = this.items[itemId];

		const newUUID = crypto.randomUUID();

		cartItem.lineItems[newUUID] = lineItem;

		// Update cartItem total count
		cartItem.totalCount += lineItem.count;
	};

	/**
	 * Removes a given line item.
	 * @param itemId the item id the line item is under.
	 * @param lineItemId the uuid of the line item.
	 */
	removeLineItem = (itemId: ItemId, lineItemId: UUID) => {
		const cartItem = this.items[itemId];

		// Update cartItem total count
		const lineItemCount = cartItem.lineItems[lineItemId].count;
		cartItem.totalCount -= lineItemCount;

		// Delete line item
		delete cartItem.lineItems[lineItemId];
	};

	/**
	 * Removes any items from the cart that are not passed in the list of valid items.
	 * @param validItems an array containing item objects to check the cart against
	 * @returns this Cart.
	 */
	validateEntries = (validItems: Item[]) => {
		const verifiedItems: Record<ItemId, TCartItem> = {};

		const currItems = this.getItems();

		for (const v of validItems) {
			if (currItems[v.id]) {
				verifiedItems[v.id] = currItems[v.id];
			}
		}

		this.setItems(verifiedItems);

		return this;
	};

	/**
	 * Returns an array of items with their ids, counts, and differentiated by their selections.
	 */
	toUnfoldedArray = (): UnfoldedCart => {
		const items = this.getItems();
		const arr: UnfoldedCart = [];

		// Map every cart item to new object
		for (const key in items) {
			const item: any = items[key];

			// Add id to item object
			item.id = key;

			// Unwrap lineItems into array
			item.lineItems = Object.keys(item.lineItems).map((k) => ({
				id: k,
				...item.lineItems[k],
			}));

			// Add new item to array
			arr.push(item);
		}

		return arr;
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
