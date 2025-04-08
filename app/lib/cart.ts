import type ItemType from "~/lib/item";
import type { Item } from "~/lib/item";

export class Cart {
	readonly items: CartItem[];

	constructor(cartItems?: CartItem[]) {
		if (cartItems) {
			this.items = cartItems;
		} else {
			this.items = [];
		}
	}

	/**
	 * Adds a given item type to the cart items if it does not already exist.
	 * @param itemType - The type to add.
	 */
	addCartItem = (itemType: ItemType) => {
		// Check for matching types
		const typeIndex = this.items.findIndex(
			(cartItem) => cartItem.type.id === itemType.id,
		);
		if (typeIndex >= 0) return;

		this.items.push({
			type: itemType,
			children: [],
		});
	};

	/**
	 * Removes the first CartItem with a matching ItemType.
	 * @param itemType - The type to match against.
	 * @returns The removed CartItem if found, or undefined otherwise.
	 */
	removeCartItem = (itemType: ItemType) => {
		const typeIndex = this.items.findIndex(
			(cartItem) => cartItem.type.id === itemType.id,
		);

		if (typeIndex >= 0) {
			const removedFamily = this.items[typeIndex];
			this.items.splice(typeIndex, 1);
			return removedFamily;
		}

		return undefined;
	};

	/**
	 * Returns the CartItem representing an item family if found in this Cart.
	 * @param itemType - The type to search for.
	 * @returns The CartItem if found, and undefined otherwise.
	 */
	findCartItem = (itemType: ItemType) => {
		return this.items.find((cartItem) => cartItem.type.id === itemType.id);
	};

	/**
	 * Adds an item type child to its corresponding item type. This child either iterates the count of an identical child, or is added itself.
	 * @param child - The item to add.
	 * @param count - The number of items to add. Must be a positive number.
	 */
	addCartItemChild = (child: Item, count: number) => {
		if (count <= 0) return;
		const typeIndex = this.items.findIndex(
			(cartItem) => cartItem.type.id === child.typeId,
		);

		// Type existed in cart
		if (typeIndex >= 0) {
			const itemIndex = this.items[typeIndex].children.findIndex(
				(c: CartItemChild) => c.item.selectKey === child.selectKey,
			);

			// Find child
			if (itemIndex >= 0) {
				this.items[typeIndex].children[itemIndex] = {
					item: child,
					count: this.items[typeIndex].children[itemIndex].count + count,
				};
				return this.items[typeIndex].children[itemIndex];
			}
			// Child not found
			else {
				this.items[typeIndex].children.push({
					item: child,
					count: count,
				});
				return this.items[typeIndex].children[
					this.items[typeIndex].children.length - 1
				];
			}
		}
		return undefined;
	};

	/**
	 * Removes the specified number of items from the corresponding item child.
	 * @param child - The item to search for.
	 * @param count - The number of items to remove.
	 * @returns True if the operation was successful. False if this failed.
	 */
	removeCartItemChild = (child: Item, count: number) => {
		if (count <= 0) return;
		const typeIndex = this.items.findIndex(
			(cartItem) => cartItem.type.id === child.typeId,
		);

		// Type existed in cart
		if (typeIndex >= 0) {
			const itemIndex = this.items[typeIndex].children.findIndex(
				(c: CartItemChild) => c.item.selectKey === child.selectKey,
			);

			// Find child
			if (itemIndex >= 0) {
				this.items[typeIndex].children[itemIndex] = {
					item: child,
					count: this.items[typeIndex].children[itemIndex].count - count,
				};

				if (this.items[typeIndex].children[itemIndex].count <= 0) {
					this.items[typeIndex].children.splice(itemIndex, 1);
				}

				return true;
			}
		}
		return false;
	};

	/**
	 * Finds and returns the first instance of an item child corresponding to the passed item.
	 * @param item - The item to search for.
	 */
	findCartItemChild = (item: Item) => {
		const typeIndex = this.items.findIndex(
			(cartItem) => cartItem.type.id === item.typeId,
		);

		if (typeIndex >= 0) {
			return this.items[typeIndex].children.find(
				(c: CartItemChild) => c.item.selectKey === item.selectKey,
			);
		}
		return undefined;
	};

	stringify = () => {
		return JSON.stringify(this.items);
	};
}

/**
 * An object representing an item type and all subsets of that item type by their customizations.
 * @field type - The type of menu item this CartItem represents
 * @field children - The list of all user-added Items created by the parent ItemType.
 */
export interface CartItem {
	type: ItemType;
	children: CartItemChild[];
}

export interface CartItemChild {
	item: Item;
	count: number;
}
